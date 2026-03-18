// src/game/managers/AudioManager.ts
// Singleton audio manager for Insane Terrarium.
// All sounds synthesized with Web Audio API - no audio files needed.

export class AudioManager {
    private ctx: AudioContext;
    private masterGain: GainNode;
    private muted: boolean;

    private ambientNodes: AudioNode[] = [];
    private ambientTimer: ReturnType<typeof setTimeout> | null = null;
    private ambientRunning: boolean = false;

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
        this.masterGain = ctx.createGain();
        this.masterGain.connect(ctx.destination);

        const storedMuted = localStorage.getItem('audioMuted');
        if (storedMuted === 'true') {
            this.masterGain.gain.value = 0;
            this.muted = true;
        } else {
            this.masterGain.gain.value = 1;
            this.muted = false;
        }
    }

    private async resume(): Promise<void> {
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    // ---------- SFX Methods ----------

    async playCoinCollect(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
        freqs.forEach((freq, i) => {
            this.playNote(freq, 'sine', t + i * 0.08, 0.08, 0.3);
        });
    }

    async playAnimalDeath(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const freqs = [523.25, 440.00, 349.23]; // C5, A4, F4
        freqs.forEach((freq, i) => {
            this.playNote(freq, 'sine', t + i * 0.2, 0.2, 0.25);
        });
    }

    async playAnimalGrow(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const freqs = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        freqs.forEach((freq, i) => {
            const startTime = t + i * 0.1;
            const duration = 0.1;
            const peakGain = 0.25;

            // 70% sine
            this.playNote(freq, 'sine', startTime, duration, peakGain * 0.7);

            // 30% triangle
            this.playNote(freq, 'triangle', startTime, duration, peakGain * 0.3);
        });
    }

    async playFoodDrop(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const duration = 0.15;
        const sampleRate = this.ctx.sampleRate;
        const bufferSize = Math.floor(sampleRate * duration);

        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        let prev = 0;
        let maxAbs = 0;
        for (let i = 0; i < bufferSize; i++) {
            const randn = Math.random() * 2 - 1;
            prev = prev * 0.99 + randn * 0.02;
            data[i] = prev;
            if (Math.abs(prev) > maxAbs) maxAbs = Math.abs(prev);
        }
        if (maxAbs > 0) {
            for (let i = 0; i < bufferSize; i++) {
                data[i] /= maxAbs;
            }
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start(t);
        source.stop(t + duration);
        source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    }

    async playEating(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const duration = 0.1;
        const bufferSize = 4096;
        const sampleRate = this.ctx.sampleRate;

        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        gain.gain.setValueAtTime(0.15, t + 0.01 + 0.06);
        gain.gain.linearRampToValueAtTime(0, t + 0.01 + 0.06 + 0.03);

        source.connect(gain);
        gain.connect(this.masterGain);

        source.start(t);
        source.stop(t + duration);
        source.onended = () => { source.disconnect(); gain.disconnect(); };
    }

    async playPoacherAlert(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;

        // Pulse 1
        {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.type = 'sine';
            osc.frequency.value = 120;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.3);
            osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        }

        // Pulse 2 (starts at t + 0.45s)
        {
            const t2 = t + 0.45;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.type = 'sine';
            osc.frequency.value = 120;
            gain.gain.setValueAtTime(0, t2);
            gain.gain.linearRampToValueAtTime(0.4, t2 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.3);
            osc.start(t2);
            osc.stop(t2 + 0.3);
            osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        }
    }

    async playPoacherHit(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.linearRampToValueAtTime(60, t + 0.15);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    }

    async playWin(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, i) => {
            this.playNote(freq, 'triangle', t + i * 0.18, 0.2, 0.35);
        });
    }

    async playGameOver(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;
        const freqs = [523.25, 440.00, 349.23, 293.66]; // C5, A4, F4, D4
        freqs.forEach((freq, i) => {
            this.playNote(freq, 'sine', t + i * 0.28, 0.3, 0.25);
        });
    }

    async playPurchase(): Promise<void> {
        await this.resume();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.type = 'sine';
        osc.frequency.value = 1047;
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    }

    // ---------- Ambient Methods ----------

    async startAmbient(): Promise<void> {
        if (this.ambientRunning) return;
        this.ambientRunning = true;
        await this.resume();

        // Node 1: Wind texture (brown noise → bandpass → gain)
        {
            const sampleRate = this.ctx.sampleRate;
            const bufferSize = sampleRate; // 1 second
            const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
            const data = buffer.getChannelData(0);
            let prev = 0;
            let maxAbs = 0;
            for (let i = 0; i < bufferSize; i++) {
                const randn = Math.random() * 2 - 1;
                prev = prev * 0.99 + randn * 0.02;
                data[i] = prev;
                if (Math.abs(prev) > maxAbs) maxAbs = Math.abs(prev);
            }
            if (maxAbs > 0) {
                for (let i = 0; i < bufferSize; i++) {
                    data[i] /= maxAbs;
                }
            }

            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 300;
            filter.Q.value = 0.5;

            const gainNode = this.ctx.createGain();
            gainNode.gain.value = 0.08;

            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);

            source.start();
            this.ambientNodes.push(source, filter, gainNode);
        }

        // Node 2: Low drone
        {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 130;

            const gainNode = this.ctx.createGain();
            gainNode.gain.value = 0.10;

            osc.connect(gainNode);
            gainNode.connect(this.masterGain);

            osc.start();
            this.ambientNodes.push(osc, gainNode);
        }

        // Node 3: Pentatonic notes
        {
            const scale = [261.63, 329.63, 392.00, 440.00, 523.25]; // C4, E4, G4, A4, C5

            const scheduleNextNote = (): void => {
                const freq = scale[Math.floor(Math.random() * scale.length)];
                this.playNote(freq, 'sine', this.ctx.currentTime, 1.5, 0.12);
                const delay = 5000 + Math.random() * 5000;
                this.ambientTimer = setTimeout(() => scheduleNextNote(), delay);
            };

            scheduleNextNote();
        }
    }

    stopAmbient(): void {
        this.ambientRunning = false;

        if (this.ambientTimer !== null) {
            clearTimeout(this.ambientTimer);
            this.ambientTimer = null;
        }

        for (const node of this.ambientNodes) {
            try {
                if (node instanceof AudioScheduledSourceNode) {
                    node.stop();
                }
                node.disconnect();
            } catch {
                // ignore errors from already-stopped nodes
            }
        }
        this.ambientNodes = [];
    }

    // ---------- Control Methods ----------

    setMuted(muted: boolean): void {
        this.muted = muted;
        this.masterGain.gain.value = muted ? 0 : 1;
        localStorage.setItem('audioMuted', String(muted));
    }

    isMuted(): boolean {
        return this.muted;
    }

    // ---------- Private Helpers ----------

    private playNote(
        freq: number,
        type: OscillatorType,
        startTime: number,
        duration: number,
        peakGain: number
    ): void {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.type = type;
        osc.frequency.value = freq;
        const attackDuration = Math.min(0.01, duration * 0.1);
        const decayStart = startTime + attackDuration;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, decayStart);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    }
}
