import Phaser from 'phaser';
import { PoacherConfig } from '../config/LevelData';
import { Animal } from '../entities/Animal';
import { Poacher } from '../entities/Poacher';

export class PoacherAI {
    private scene: Phaser.Scene;
    private config: PoacherConfig;
    private activePoacherGroup: Phaser.GameObjects.Group;
    private spawnTimer!: Phaser.Time.TimerEvent;
    private speedMultiplier: number = 1;
    private autoDamageInterval: number = 0; // ms, 0 = disabled (set by Mantis helper)
    private getAnimals: () => Animal[];

    constructor(
        scene: Phaser.Scene,
        config: PoacherConfig,
        getAnimals: () => Animal[],
    ) {
        this.scene = scene;
        this.config = config;
        this.getAnimals = getAnimals;

        this.activePoacherGroup = scene.add.group({ runChildUpdate: true });

        // Start spawn timer
        this.spawnTimer = scene.time.addEvent({
            delay: config.frequency,
            callback: this.trySpawn,
            callbackScope: this,
            loop: true,
        });

        // First spawn after a delay to give player time to settle in
        scene.time.delayedCall(config.frequency * 0.6, () => this.trySpawn());
    }

    setSpeedMultiplier(multiplier: number): void {
        this.speedMultiplier = multiplier;
    }

    setAutoDamageInterval(intervalMs: number): void {
        this.autoDamageInterval = intervalMs;
    }

    private trySpawn(): void {
        if (this.activePoacherGroup.countActive() >= this.config.maxOverlapping) return;

        const animals = this.getAnimals();
        if (animals.length === 0) return;

        const poacher = new Poacher(this.scene, this.config);

        if (this.speedMultiplier !== 1) {
            poacher.setSpeedMultiplier(this.speedMultiplier);
        }

        // Screen shake warning
        this.scene.cameras.main.shake(300, 0.005);

        // Target the most valuable animal
        const target = this.pickTarget(animals);
        if (target) {
            poacher.setTarget(target);
        }

        // Auto-damage from helper pets (Mantis)
        if (this.autoDamageInterval > 0) {
            const autoTimer = this.scene.time.addEvent({
                delay: this.autoDamageInterval,
                callback: () => {
                    if (poacher.active) poacher.takeDamage();
                },
                loop: true,
            });
            poacher.on('destroy', () => autoTimer.destroy());
        }

        poacher.on('repelled', () => {
            this.activePoacherGroup.remove(poacher, false);
        });

        poacher.on('grabbed', () => {
            this.activePoacherGroup.remove(poacher, false);
        });

        poacher.on('destroy', () => {
            this.activePoacherGroup.remove(poacher, false);
        });

        this.activePoacherGroup.add(poacher);
    }

    private pickTarget(animals: Animal[]): Animal | null {
        if (animals.length === 0) return null;
        // Target most valuable (highest coin value)
        return animals.reduce((best, a) =>
            a.config.coinValue > best.config.coinValue ? a : best
        );
    }

    destroy(): void {
        this.spawnTimer?.destroy();
        this.activePoacherGroup.destroy(true);
    }
}
