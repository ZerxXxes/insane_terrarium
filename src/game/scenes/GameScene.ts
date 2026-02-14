import Phaser from 'phaser';
import { GAME_WIDTH, SUBSTRATE_TOP, SUBSTRATE_BOTTOM } from '../config/GameConfig';
import { ANIMAL_DATA, AnimalConfig } from '../config/AnimalData';
import { FOOD_DATA } from '../config/FoodData';
import { getLevelConfig } from '../config/LevelData';
import { Animal } from '../entities/Animal';
import { Food } from '../entities/Food';
import { Coin } from '../entities/Coin';
import {
    HelperPet,
    applyTortoiseBehavior,
    applyHermitCrabBehavior,
    applySnailBehavior,
    applyBeetleBehavior,
    applyMillipedeBehavior,
    applySnakeBehavior,
} from '../entities/HelperPet';
import { EconomyManager } from '../managers/EconomyManager';
import { LevelManager } from '../managers/LevelManager';
import { HelperManager } from '../managers/HelperManager';
import { HUD } from '../ui/HUD';
import { ShopBar } from '../ui/ShopBar';
import { PoacherAI } from '../systems/PoacherAI';

export class GameScene extends Phaser.Scene {
    level: number = 1;
    selectedFoodType: string = 'cricket';

    private animals!: Phaser.GameObjects.Group;
    private foods!: Phaser.GameObjects.Group;
    private coinGroup!: Phaser.GameObjects.Group;
    private helperPetGroup!: Phaser.GameObjects.Group;
    private economy!: EconomyManager;
    private levelManager!: LevelManager;
    poacherAI: PoacherAI | null = null;

    // Helper pet effect hooks
    private coinBoostFn: ((x: number, y: number) => number) | null = null;
    private nutritionMultiplierFn: (() => number) | null = null;
    private breedCheckFn: (() => boolean) | null = null;

    constructor() {
        super('GameScene');
    }

    init(data: { level?: number }): void {
        this.level = data.level ?? 1;
        this.selectedFoodType = 'cricket';
        this.coinBoostFn = null;
        this.nutritionMultiplierFn = null;
        this.breedCheckFn = null;
    }

    create(): void {
        const levelConfig = getLevelConfig(this.level);

        // Economy
        this.economy = new EconomyManager(levelConfig.startCoins);

        // Level manager
        this.levelManager = new LevelManager(this, this.economy, this.level);

        // Background
        this.add.image(GAME_WIDTH / 2, this.scale.height / 2, 'terrarium_bg');

        // Groups
        this.animals = this.add.group({ runChildUpdate: true });
        this.foods = this.add.group({ runChildUpdate: true });
        this.coinGroup = this.add.group({ runChildUpdate: true });
        this.helperPetGroup = this.add.group({ runChildUpdate: true });

        // HUD
        new HUD(this, this.economy, this.level);

        // Shop bar
        new ShopBar(this, this.economy, this.level);

        // Spawn starting animals
        this.spawnStarterAnimals();

        // Click to drop food (but not on interactive shop items)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.y >= SUBSTRATE_TOP && pointer.y <= SUBSTRATE_BOTTOM) {
                this.dropFood(pointer.x, pointer.y);
            }
        });

        // Physics overlap: animals eat food
        this.physics.add.overlap(this.animals, this.foods, (_animalObj, _foodObj) => {
            const animal = _animalObj as Animal;
            const food = _foodObj as Food;
            if (!animal.isAlive || !animal.isHungry || !food.active) return;

            let nutrition = food.nutrition;
            if (this.nutritionMultiplierFn) {
                nutrition *= this.nutritionMultiplierFn();
            }

            animal.feed(nutrition);
            food.destroy();

            // Tree Snake breed check
            if (this.breedCheckFn && this.breedCheckFn()) {
                this.spawnAnimal(animal.config);
            }
        });

        // Shop events
        this.events.on('buyAnimal', (key: string) => {
            const config = ANIMAL_DATA[key];
            if (config) this.spawnAnimal(config);
        });

        this.events.on('selectFood', (key: string) => {
            this.selectedFoodType = key;
        });

        // Poacher AI (level 2+)
        if (levelConfig.poacherConfig) {
            this.poacherAI = new PoacherAI(
                this,
                levelConfig.poacherConfig,
                () => this.getAnimals(),
            );
        }

        // Spawn helper pets
        this.spawnHelperPets();
    }

    update(_time: number, _delta: number): void {
        // Make hungry animals seek nearby food
        const animals = this.animals.getChildren() as Animal[];
        const foods = this.foods.getChildren() as Food[];

        for (const animal of animals) {
            if (!animal.active || !animal.isAlive || !animal.isHungry) continue;
            let closest: Food | null = null;
            let closestDist = Infinity;
            for (const food of foods) {
                if (!food.active) continue;
                const dist = Phaser.Math.Distance.Between(animal.x, animal.y, food.x, food.y);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = food;
                }
            }
            if (closest) {
                animal.seekFood(closest);
            }
        }

        // Check game over
        this.levelManager.checkGameOver(this.animals.countActive());
    }

    spawnAnimal(config: AnimalConfig): Animal {
        const x = Phaser.Math.Between(60, GAME_WIDTH - 60);
        const y = Phaser.Math.Between(SUBSTRATE_TOP + 30, SUBSTRATE_BOTTOM - 30);
        const animal = new Animal(this, x, y, config);

        animal.on('dropCoin', (data: { x: number; y: number; value: number }) => {
            let value = data.value;
            if (this.coinBoostFn) {
                value = Math.round(value * this.coinBoostFn(data.x, data.y));
            }
            this.spawnCoin(data.x, data.y, value);
        });

        animal.on('died', () => {
            this.animals.remove(animal, true);
        });

        this.animals.add(animal);
        return animal;
    }

    getAnimals(): Animal[] {
        return this.animals.getChildren().filter(a => (a as Animal).isAlive) as Animal[];
    }

    private spawnStarterAnimals(): void {
        for (let i = 0; i < 2; i++) {
            this.spawnAnimal(ANIMAL_DATA.gecko);
        }
    }

    private spawnHelperPets(): void {
        const helperManager = new HelperManager(this.game);
        const ownedConfigs = helperManager.getOwnedConfigs();

        for (const config of ownedConfigs) {
            const pet = new HelperPet(this, config);
            this.helperPetGroup.add(pet);

            switch (config.key) {
                case 'tortoise':
                    applyTortoiseBehavior(this, pet, this.foods);
                    break;
                case 'hermit_crab':
                    applyHermitCrabBehavior(this, pet, this.coinGroup);
                    break;
                case 'mantis':
                    if (this.poacherAI) {
                        this.poacherAI.setAutoDamageInterval(config.effectParams.damageInterval ?? 1000);
                    }
                    break;
                case 'snail': {
                    const snailEffect = applySnailBehavior(this, pet);
                    this.coinBoostFn = snailEffect.getBoost;
                    break;
                }
                case 'beetle': {
                    const beetleEffect = applyBeetleBehavior(this, pet);
                    this.nutritionMultiplierFn = beetleEffect.getNutritionMultiplier;
                    break;
                }
                case 'scorpion':
                    if (this.poacherAI) {
                        this.poacherAI.setSpeedMultiplier(config.effectParams.slowFactor ?? 0.7);
                    }
                    break;
                case 'snake': {
                    const snakeEffect = applySnakeBehavior(this, pet);
                    this.breedCheckFn = snakeEffect.shouldBreed;
                    break;
                }
                case 'millipede':
                    applyMillipedeBehavior(this, pet, (x, y, v) => this.spawnCoin(x, y, v));
                    break;
            }
        }
    }

    private dropFood(x: number, y: number): void {
        const foodConfig = FOOD_DATA[this.selectedFoodType];
        if (!foodConfig) return;

        if (foodConfig.cost > 0) {
            if (!this.economy.spendCoins(foodConfig.cost)) return;
        }

        const food = new Food(this, x, y, foodConfig);
        this.foods.add(food);
    }

    private spawnCoin(x: number, y: number, value: number): void {
        const coin = new Coin(this, x, y, value);
        coin.on('collected', (data: { value: number }) => {
            this.economy.addCoins(data.value);
        });
        this.coinGroup.add(coin);
    }
}
