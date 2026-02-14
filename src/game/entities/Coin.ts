import Phaser from 'phaser';

const FLOAT_DURATION = 500;
const FLOAT_HEIGHT = 30;
const COIN_LIFETIME = 15000; // 15 seconds
const FADE_WARNING_AT = 12000; // start fading at 12s

export class Coin extends Phaser.GameObjects.Sprite {
    value: number;
    private spawnTime: number;

    constructor(scene: Phaser.Scene, x: number, y: number, value: number) {
        super(scene, x, y, 'coin');

        this.value = value;
        this.spawnTime = scene.time.now;

        scene.add.existing(this);
        this.setDepth(15);
        this.setScale(0.04); // 512px -> ~20px in-game
        this.setInteractive({ useHandCursor: true });

        // Float up animation
        scene.tweens.add({
            targets: this,
            y: y - FLOAT_HEIGHT,
            duration: FLOAT_DURATION,
            ease: 'Quad.easeOut',
            yoyo: true,
            onComplete: () => {
                this.y = y;
            },
        });

        // Play spin animation
        if (scene.anims.exists('coin_spin')) {
            this.play('coin_spin');
        }

        // Click to collect
        this.on('pointerdown', () => this.collect());

        // Auto-destroy after lifetime
        scene.time.delayedCall(COIN_LIFETIME, () => {
            if (this.active) this.destroy();
        });
    }

    update(): void {
        if (!this.active) return;

        // Fade warning as coin approaches expiry
        const age = this.scene.time.now - this.spawnTime;
        if (age > FADE_WARNING_AT) {
            const remaining = COIN_LIFETIME - age;
            const fadeRatio = remaining / (COIN_LIFETIME - FADE_WARNING_AT);
            this.setAlpha(Math.max(0.2, fadeRatio));
        }
    }

    collect(): void {
        if (!this.active) return;

        this.removeInteractive();
        this.emit('collected', { value: this.value, x: this.x, y: this.y });

        this.scene.tweens.add({
            targets: this,
            scaleX: 0.08,
            scaleY: 0.08,
            alpha: 0,
            duration: 200,
            ease: 'Quad.easeOut',
            onComplete: () => this.destroy(),
        });
    }
}
