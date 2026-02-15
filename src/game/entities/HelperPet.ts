import Phaser from 'phaser';
import { HelperPetConfig } from '../config/HelperPetData';
import { SUBSTRATE_TOP, SUBSTRATE_BOTTOM, GAME_WIDTH } from '../config/GameConfig';
import { FOOD_DATA } from '../config/FoodData';
import { Animal } from './Animal';
import { Food } from './Food';
import { Coin } from './Coin';

const MARGIN = 20;
const WANDER_SPEED = 40;
const WANDER_PAUSE_MIN = 2000;
const WANDER_PAUSE_MAX = 5000;

export class HelperPet extends Phaser.GameObjects.Sprite {
    petConfig: HelperPetConfig;
    private wanderTarget: { x: number; y: number } | null = null;
    private wanderPauseTimer: number = 0;

    constructor(scene: Phaser.Scene, config: HelperPetConfig) {
        const x = Phaser.Math.Between(60, GAME_WIDTH - 60);
        const y = Phaser.Math.Between(SUBSTRATE_TOP + 30, SUBSTRATE_BOTTOM - 30);
        super(scene, x, y, config.spriteKey);

        this.petConfig = config;
        this.setDepth(12);
        this.setScale(0.08); // 512px -> ~40px in-game

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(_time: number, delta: number): void {
        if (!this.active) return;
        this.wander(delta);
    }

    private wander(delta: number): void {
        if (this.wanderPauseTimer > 0) {
            this.wanderPauseTimer -= delta;
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(0, 0);
            this.playIdle();
            return;
        }

        if (!this.wanderTarget || this.reachedTarget()) {
            this.wanderPauseTimer = Phaser.Math.Between(WANDER_PAUSE_MIN, WANDER_PAUSE_MAX);
            this.wanderTarget = {
                x: Phaser.Math.Between(MARGIN, GAME_WIDTH - MARGIN),
                y: Phaser.Math.Between(SUBSTRATE_TOP + MARGIN, SUBSTRATE_BOTTOM - MARGIN),
            };
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(0, 0);
            this.playIdle();
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.wanderTarget.x, this.wanderTarget.y);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(Math.cos(angle) * WANDER_SPEED, Math.sin(angle) * WANDER_SPEED);
        this.setFlipX(body.velocity.x < 0);
        this.playWalk();
    }

    private playWalk(): void {
        const walkKey = `${this.petConfig.spriteKey}_walk`;
        if (this.scene.anims.exists(walkKey) && this.anims.currentAnim?.key !== walkKey) {
            this.play(walkKey);
        }
    }

    private playIdle(): void {
        const idleKey = `${this.petConfig.spriteKey}_idle`;
        if (this.scene.anims.exists(idleKey) && this.anims.currentAnim?.key !== idleKey) {
            this.play(idleKey);
        }
    }

    private reachedTarget(): boolean {
        if (!this.wanderTarget) return true;
        return Phaser.Math.Distance.Between(this.x, this.y, this.wanderTarget.x, this.wanderTarget.y) < 10;
    }
}

// --- Behavior functions applied per pet type in GameScene ---

export function applyTortoiseBehavior(scene: Phaser.Scene, pet: HelperPet, foodGroup: Phaser.GameObjects.Group): void {
    const interval = pet.petConfig.effectParams.interval ?? 20000;
    scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => {
            if (!pet.active) return;
            const cricketConfig = FOOD_DATA.cricket;
            const food = new Food(scene, pet.x, pet.y, cricketConfig);
            foodGroup.add(food);
        },
    });
}

export function applyHermitCrabBehavior(scene: Phaser.Scene, pet: HelperPet, coinGroup: Phaser.GameObjects.Group): void {
    const radius = pet.petConfig.effectParams.collectRadius ?? 120;
    scene.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
            if (!pet.active) return;
            const coins = coinGroup.getChildren() as Coin[];
            for (const coin of coins) {
                if (!coin.active) continue;
                const dist = Phaser.Math.Distance.Between(pet.x, pet.y, coin.x, coin.y);
                if (dist < radius) {
                    coin.collect();
                }
            }
        },
    });
}

export function applySnailBehavior(_scene: Phaser.Scene, pet: HelperPet): { getBoost: (animalX: number, animalY: number) => number } {
    const radius = pet.petConfig.effectParams.boostRadius ?? 150;
    const multiplier = pet.petConfig.effectParams.boostMultiplier ?? 1.5;
    return {
        getBoost: (animalX: number, animalY: number) => {
            if (!pet.active) return 1;
            const dist = Phaser.Math.Distance.Between(pet.x, pet.y, animalX, animalY);
            return dist < radius ? multiplier : 1;
        },
    };
}

export function applyBeetleBehavior(_scene: Phaser.Scene, pet: HelperPet): { getNutritionMultiplier: () => number } {
    const multiplier = pet.petConfig.effectParams.nutritionMultiplier ?? 2;
    return {
        getNutritionMultiplier: () => pet.active ? multiplier : 1,
    };
}

export function applyMillipedeBehavior(scene: Phaser.Scene, pet: HelperPet, spawnCoin: (x: number, y: number, value: number) => void): void {
    const interval = pet.petConfig.effectParams.coinInterval ?? 10000;
    const value = pet.petConfig.effectParams.coinValue ?? 1;
    scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => {
            if (!pet.active) return;
            spawnCoin(pet.x, pet.y, value);
        },
    });
}

export function applySnakeBehavior(_scene: Phaser.Scene, pet: HelperPet): { shouldBreed: () => boolean } {
    const chance = pet.petConfig.effectParams.breedChance ?? 0.1;
    return {
        shouldBreed: () => pet.active && Math.random() < chance,
    };
}
