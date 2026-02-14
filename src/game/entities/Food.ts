import Phaser from 'phaser';
import { FoodConfig } from '../config/FoodData';
import { SUBSTRATE_BOTTOM } from '../config/GameConfig';

const FOOD_LIFETIME = 30000; // 30 seconds
const FALL_DURATION = 400;

export class Food extends Phaser.GameObjects.Sprite {
    foodConfig: FoodConfig;
    nutrition: number;
    private crawlDirection: number;
    private settled: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, foodConfig: FoodConfig) {
        super(scene, x, y, foodConfig.spriteKey);

        this.foodConfig = foodConfig;
        this.nutrition = foodConfig.nutrition;
        this.crawlDirection = Math.random() < 0.5 ? -1 : 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(5);
        this.setScale(0.04); // 512px -> ~20px in-game

        // Fall to substrate level
        const targetY = Math.min(y, SUBSTRATE_BOTTOM - 16);
        if (this.y < targetY) {
            scene.tweens.add({
                targets: this,
                y: targetY,
                duration: FALL_DURATION,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.settled = true;
                },
            });
        } else {
            this.y = targetY;
            this.settled = true;
        }

        // Auto-destroy after lifetime
        scene.time.delayedCall(FOOD_LIFETIME, () => {
            if (this.active) {
                scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => this.destroy(),
                });
            }
        });
    }

    update(_time: number, delta: number): void {
        if (!this.active || !this.settled) return;

        // Crawl left/right
        this.x += this.crawlDirection * this.foodConfig.speed * (delta / 1000);

        // Bounce off edges
        if (this.x < 20 || this.x > this.scene.scale.width - 20) {
            this.crawlDirection *= -1;
        }

        this.setFlipX(this.crawlDirection < 0);
    }
}
