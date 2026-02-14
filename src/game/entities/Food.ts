import Phaser from 'phaser';
import { FoodConfig } from '../config/FoodData';
import { SUBSTRATE_TOP, SUBSTRATE_BOTTOM, GAME_WIDTH } from '../config/GameConfig';

const FOOD_LIFETIME = 30000; // 30 seconds
const FALL_DURATION = 400;
const DIRECTION_CHANGE_MIN = 800;
const DIRECTION_CHANGE_MAX = 2500;
const MARGIN = 20;

export class Food extends Phaser.GameObjects.Sprite {
    foodConfig: FoodConfig;
    nutrition: number;
    private moveAngle: number;
    private settled: boolean = false;
    private directionTimer: number = 0;
    private glow: Phaser.GameObjects.Ellipse;

    constructor(scene: Phaser.Scene, x: number, y: number, foodConfig: FoodConfig) {
        super(scene, x, y, foodConfig.spriteKey);

        this.foodConfig = foodConfig;
        this.nutrition = foodConfig.nutrition;
        this.moveAngle = Math.random() * Math.PI * 2;
        this.directionTimer = Phaser.Math.Between(DIRECTION_CHANGE_MIN, DIRECTION_CHANGE_MAX);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(5);
        this.setScale(0.04); // 512px -> ~20px in-game

        // Glowing indicator beneath food for visibility
        this.glow = scene.add.ellipse(x, y + 6, 24, 10, 0x22c55e, 0.35);
        this.glow.setDepth(4);
        scene.tweens.add({
            targets: this.glow,
            alpha: { from: 0.2, to: 0.45 },
            scaleX: { from: 0.9, to: 1.1 },
            scaleY: { from: 0.9, to: 1.1 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Fall to substrate level
        const targetY = Math.min(y, SUBSTRATE_BOTTOM - 16);
        if (this.y < targetY) {
            this.glow.setVisible(false);
            scene.tweens.add({
                targets: this,
                y: targetY,
                duration: FALL_DURATION,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.settled = true;
                    this.glow.setVisible(true);
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
                    targets: [this, this.glow],
                    alpha: 0,
                    duration: 500,
                    onComplete: () => this.destroy(),
                });
            }
        });
    }

    update(_time: number, delta: number): void {
        if (!this.active || !this.settled) return;

        // Pick a new random direction periodically
        this.directionTimer -= delta;
        if (this.directionTimer <= 0) {
            this.moveAngle = Math.random() * Math.PI * 2;
            this.directionTimer = Phaser.Math.Between(DIRECTION_CHANGE_MIN, DIRECTION_CHANGE_MAX);
        }

        // Move in current direction
        const speed = this.foodConfig.speed;
        this.x += Math.cos(this.moveAngle) * speed * (delta / 1000);
        this.y += Math.sin(this.moveAngle) * speed * (delta / 1000);

        // Bounce off edges
        if (this.x < MARGIN) {
            this.x = MARGIN;
            this.moveAngle = Math.PI - this.moveAngle;
        } else if (this.x > GAME_WIDTH - MARGIN) {
            this.x = GAME_WIDTH - MARGIN;
            this.moveAngle = Math.PI - this.moveAngle;
        }
        if (this.y < SUBSTRATE_TOP + MARGIN) {
            this.y = SUBSTRATE_TOP + MARGIN;
            this.moveAngle = -this.moveAngle;
        } else if (this.y > SUBSTRATE_BOTTOM - MARGIN) {
            this.y = SUBSTRATE_BOTTOM - MARGIN;
            this.moveAngle = -this.moveAngle;
        }

        // Flip sprite based on horizontal direction
        this.setFlipX(Math.cos(this.moveAngle) < 0);

        // Update glow position
        this.glow.setPosition(this.x, this.y + 6);
    }

    destroy(fromScene?: boolean): void {
        if (this.glow?.active) {
            this.glow.destroy();
        }
        super.destroy(fromScene);
    }
}
