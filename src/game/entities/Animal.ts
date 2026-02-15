import Phaser from 'phaser';
import { AnimalConfig } from '../config/AnimalData';
import { SUBSTRATE_TOP, SUBSTRATE_BOTTOM, GAME_WIDTH } from '../config/GameConfig';
import { ThoughtBubble } from './ThoughtBubble';

const HUNGER_THRESHOLD = 0.3; // show thought bubble below 30%
const COIN_JITTER = 0.3; // +-30% random offset on coin drop interval
const HUNGER_JITTER = 0.15; // +-15% random offset on hunger rate
const WANDER_SPEED_MIN = 50;
const WANDER_SPEED_MAX = 80;
const WANDER_PAUSE_MIN = 1000;
const WANDER_PAUSE_MAX = 3000;
const MARGIN = 20;

export class Animal extends Phaser.GameObjects.Sprite {
    config: AnimalConfig;
    hunger: number;
    isAlive: boolean = true;
    isBaby: boolean = true;
    feedCount: number = 0;

    private wanderTarget: { x: number; y: number } | null = null;
    private wanderPauseTimer: number = 0;
    private isWandering: boolean = false;
    private coinDropTimer!: Phaser.Time.TimerEvent;
    private thoughtBubble: ThoughtBubble;
    private seekingFood: Phaser.GameObjects.Sprite | null = null;
    private shadow: Phaser.GameObjects.Ellipse;
    private hungerJitter: number;

    constructor(scene: Phaser.Scene, x: number, y: number, animalConfig: AnimalConfig) {
        super(scene, x, y, animalConfig.babySpriteKey);

        this.config = animalConfig;
        this.hunger = animalConfig.maxHunger;
        this.setScale(animalConfig.babySpriteScale);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(false);

        // Coin drop timer with random jitter
        this.scheduleCoinDrop();

        // Per-animal hunger jitter (fixed at spawn so each animal feels slightly different)
        this.hungerJitter = 1 + (Math.random() * 2 - 1) * HUNGER_JITTER;

        // Shadow beneath animal
        const shadowWidth = this.displayWidth * 0.7;
        const shadowHeight = this.displayWidth * 0.25;
        this.shadow = scene.add.ellipse(x, y + this.displayHeight * 0.35, shadowWidth, shadowHeight, 0x000000, 0.3);
        this.shadow.setDepth(9);

        // Thought bubble
        this.thoughtBubble = new ThoughtBubble(scene, this.displayHeight);

        this.setDepth(10);
    }

    get currentSpriteKey(): string {
        return this.isBaby ? this.config.babySpriteKey : this.config.spriteKey;
    }

    get isHungry(): boolean {
        return this.hunger < this.config.maxHunger * HUNGER_THRESHOLD;
    }

    get hungerPercent(): number {
        return this.hunger / this.config.maxHunger;
    }

    update(_time: number, delta: number): void {
        if (!this.isAlive) return;

        // Deplete hunger (jittered per-animal)
        this.hunger -= this.config.hungerRate * this.hungerJitter * (delta / 1000);
        if (this.hunger <= 0) {
            this.hunger = 0;
            this.die();
            return;
        }

        // Update thought bubble
        if (this.isHungry) {
            this.thoughtBubble.show();
        } else {
            this.thoughtBubble.hide();
            this.seekingFood = null;
        }
        this.thoughtBubble.updatePosition(this.x, this.y, delta);
        this.shadow.setPosition(this.x, this.y + this.displayHeight * 0.35);

        // Movement: seek food if hungry, otherwise wander
        if (this.isHungry && this.seekingFood && this.seekingFood.active) {
            this.moveToward(this.seekingFood.x, this.seekingFood.y, WANDER_SPEED_MAX * 1.3);
        } else {
            this.seekingFood = null;
            this.wander(delta);
        }
    }

    feed(nutrition: number): void {
        if (!this.isAlive) return;
        this.hunger = Math.min(this.hunger + nutrition, this.config.maxHunger);
        this.seekingFood = null;

        if (this.isBaby) {
            this.feedCount++;
            if (this.feedCount >= this.config.feedsToGrow) {
                this.growUp();
            }
        }
    }

    private growUp(): void {
        this.isBaby = false;

        // Swap texture to adult sprite
        this.setTexture(this.config.spriteKey);

        // Tween scale to adult size
        this.scene.tweens.add({
            targets: this,
            scaleX: this.config.spriteScale,
            scaleY: this.config.spriteScale,
            duration: 600,
            ease: 'Back.easeOut',
        });

        // Sparkle particles for growth effect
        for (let i = 0; i < 10; i++) {
            const spark = this.scene.add.circle(this.x, this.y, Phaser.Math.Between(2, 5), 0xfbbf24).setDepth(20).setAlpha(0.9);
            const angle = (Math.PI * 2 * i) / 10;
            this.scene.tweens.add({
                targets: spark,
                x: this.x + Math.cos(angle) * Phaser.Math.Between(25, 50),
                y: this.y + Math.sin(angle) * Phaser.Math.Between(25, 50),
                alpha: 0,
                scale: 2,
                duration: 600,
                ease: 'Quad.easeOut',
                onComplete: () => spark.destroy(),
            });
        }

        // Update shadow size for adult
        this.scene.time.delayedCall(600, () => {
            if (!this.active) return;
            const shadowWidth = this.displayWidth * 0.7;
            const shadowHeight = this.displayWidth * 0.25;
            this.shadow.setSize(shadowWidth, shadowHeight);
        });

        // Update thought bubble offset for larger adult
        this.scene.time.delayedCall(600, () => {
            if (!this.active) return;
            this.thoughtBubble.updateParentHeight(this.displayHeight);
        });
    }

    seekFood(food: Phaser.GameObjects.Sprite): void {
        if (!this.isHungry || !this.isAlive) return;
        // Only seek if this food is closer than current target
        if (this.seekingFood && this.seekingFood.active) {
            const currentDist = Phaser.Math.Distance.Between(this.x, this.y, this.seekingFood.x, this.seekingFood.y);
            const newDist = Phaser.Math.Distance.Between(this.x, this.y, food.x, food.y);
            if (newDist >= currentDist) return;
        }
        this.seekingFood = food;
    }

    private die(): void {
        this.isAlive = false;
        this.coinDropTimer.destroy();
        this.thoughtBubble.hide();
        this.thoughtBubble.destroy();

        this.emit('died', this);

        // Death poof particles
        for (let i = 0; i < 8; i++) {
            const poof = this.scene.add.circle(this.x, this.y, Phaser.Math.Between(3, 6), 0xaaaaaa).setDepth(20).setAlpha(0.8);
            const angle = (Math.PI * 2 * i) / 8;
            this.scene.tweens.add({
                targets: poof,
                x: this.x + Math.cos(angle) * Phaser.Math.Between(20, 40),
                y: this.y + Math.sin(angle) * Phaser.Math.Between(20, 40),
                alpha: 0,
                scale: 2,
                duration: 500,
                ease: 'Quad.easeOut',
                onComplete: () => poof.destroy(),
            });
        }

        this.scene.tweens.add({
            targets: [this, this.shadow],
            alpha: 0,
            duration: 800,
            onComplete: () => {
                this.destroy();
            },
        });
    }

    private scheduleCoinDrop(): void {
        const jitter = 1 + (Math.random() * 2 - 1) * COIN_JITTER;
        const delay = this.config.coinDropInterval * jitter;
        this.coinDropTimer = this.scene.time.delayedCall(delay, () => {
            this.tryDropCoin();
            if (this.isAlive) this.scheduleCoinDrop();
        });
    }

    private tryDropCoin(): void {
        if (!this.isAlive || this.isHungry || this.isBaby) return;
        this.emit('dropCoin', { x: this.x, y: this.y, value: this.config.coinValue });
    }

    private wander(delta: number): void {
        if (this.wanderPauseTimer > 0) {
            this.wanderPauseTimer -= delta;
            this.setVelocity(0, 0);
            return;
        }

        if (!this.wanderTarget || this.reachedTarget()) {
            // Pause before picking new target
            this.wanderPauseTimer = Phaser.Math.Between(WANDER_PAUSE_MIN, WANDER_PAUSE_MAX);
            this.wanderTarget = this.randomSubstratePoint();
            this.setVelocity(0, 0);
            return;
        }

        const speed = Phaser.Math.Between(WANDER_SPEED_MIN, WANDER_SPEED_MAX);
        this.moveToward(this.wanderTarget.x, this.wanderTarget.y, speed);
    }

    private moveToward(tx: number, ty: number, speed: number): void {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        // Flip sprite based on direction
        this.setFlipX(body.velocity.x < 0);

        // Play walk animation
        const walkKey = `${this.currentSpriteKey}_walk`;
        if (this.scene.anims.exists(walkKey) && this.anims.currentAnim?.key !== walkKey) {
            this.play(walkKey);
        }
    }

    private setVelocity(vx: number, vy: number): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(vx, vy);

        // Play idle when stopped
        if (vx === 0 && vy === 0) {
            const idleKey = `${this.currentSpriteKey}_idle`;
            if (this.scene.anims.exists(idleKey) && this.anims.currentAnim?.key !== idleKey) {
                this.play(idleKey);
            }
        }
    }

    private reachedTarget(): boolean {
        if (!this.wanderTarget) return true;
        return Phaser.Math.Distance.Between(this.x, this.y, this.wanderTarget.x, this.wanderTarget.y) < 10;
    }

    private randomSubstratePoint(): { x: number; y: number } {
        return {
            x: Phaser.Math.Between(MARGIN, GAME_WIDTH - MARGIN),
            y: Phaser.Math.Between(SUBSTRATE_TOP + MARGIN, SUBSTRATE_BOTTOM - MARGIN),
        };
    }

    destroy(fromScene?: boolean): void {
        this.coinDropTimer?.destroy();
        if (this.thoughtBubble?.active) {
            this.thoughtBubble.destroy();
        }
        if (this.shadow?.active) {
            this.shadow.destroy();
        }
        super.destroy(fromScene);
    }
}
