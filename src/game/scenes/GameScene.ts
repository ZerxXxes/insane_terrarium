import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SHOP_BAR_HEIGHT, SUBSTRATE_TOP, SUBSTRATE_BOTTOM } from '../config/GameConfig';
import { ANIMAL_DATA, AnimalConfig } from '../config/AnimalData';
import { FOOD_DATA } from '../config/FoodData';
import { getLevelConfig } from '../config/LevelData';
import { Animal } from '../entities/Animal';
import { Food } from '../entities/Food';
import { Coin } from '../entities/Coin';

export class GameScene extends Phaser.Scene {
    level: number = 1;
    coins: number = 0;
    selectedFoodType: string = 'cricket';

    private animals!: Phaser.GameObjects.Group;
    private foods!: Phaser.GameObjects.Group;
    private coinGroup!: Phaser.GameObjects.Group;
    private coinText!: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene');
    }

    init(data: { level?: number }): void {
        this.level = data.level ?? 1;
        const levelConfig = getLevelConfig(this.level);
        this.coins = levelConfig.startCoins;
        this.selectedFoodType = 'cricket';
    }

    create(): void {
        // Background
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'terrarium_bg');

        // Groups
        this.animals = this.add.group({ runChildUpdate: true });
        this.foods = this.add.group({ runChildUpdate: true });
        this.coinGroup = this.add.group({ runChildUpdate: true });

        // Level indicator
        this.add.text(GAME_WIDTH / 2, 20, `Level ${this.level}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5, 0).setDepth(100);

        // Coin counter (temporary HUD — will be replaced by proper HUD in Phase 3)
        const coinIcon = this.add.image(40, 20, 'coin').setDepth(100).setScale(1.2);
        this.coinText = this.add.text(58, 12, `${this.coins}`, {
            fontSize: '22px',
            color: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        }).setDepth(100);

        // Shop bar placeholder
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT - SHOP_BAR_HEIGHT / 2, 'shop_bar_bg').setDepth(90);

        // Spawn starting animals
        this.spawnStarterAnimals();

        // Click to drop food
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Only drop food in the substrate area (not on shop bar)
            if (pointer.y >= SUBSTRATE_TOP && pointer.y <= SUBSTRATE_BOTTOM) {
                this.dropFood(pointer.x, pointer.y);
            }
        });

        // Physics overlap: animals eat food
        this.physics.add.overlap(this.animals, this.foods, (_animalObj, _foodObj) => {
            const animal = _animalObj as Animal;
            const food = _foodObj as Food;
            if (!animal.isAlive || !animal.isHungry || !food.active) return;

            animal.feed(food.nutrition);
            food.destroy();
        });
    }

    update(time: number, delta: number): void {
        // Update coin display
        this.coinText.setText(`${this.coins}`);

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

        // Check game over: no animals and can't afford cheapest
        if (this.animals.countActive() === 0) {
            const cheapest = this.getCheapestAnimalCost();
            if (this.coins < cheapest) {
                this.scene.start('GameOverScene');
            }
        }
    }

    private spawnStarterAnimals(): void {
        // Start with 2 geckos
        for (let i = 0; i < 2; i++) {
            this.spawnAnimal(ANIMAL_DATA.gecko);
        }
    }

    spawnAnimal(config: AnimalConfig): Animal {
        const x = Phaser.Math.Between(60, GAME_WIDTH - 60);
        const y = Phaser.Math.Between(SUBSTRATE_TOP + 30, SUBSTRATE_BOTTOM - 30);
        const animal = new Animal(this, x, y, config);

        animal.on('dropCoin', (data: { x: number; y: number; value: number }) => {
            this.spawnCoin(data.x, data.y, data.value);
        });

        animal.on('died', () => {
            this.animals.remove(animal, true);
        });

        this.animals.add(animal);
        return animal;
    }

    private dropFood(x: number, y: number): void {
        const foodConfig = FOOD_DATA[this.selectedFoodType];
        if (!foodConfig) return;

        // Deduct cost (free for crickets)
        if (foodConfig.cost > 0) {
            if (this.coins < foodConfig.cost) return;
            this.coins -= foodConfig.cost;
        }

        const food = new Food(this, x, y, foodConfig);
        this.foods.add(food);
    }

    private spawnCoin(x: number, y: number, value: number): void {
        const coin = new Coin(this, x, y, value);
        coin.on('collected', (data: { value: number }) => {
            this.coins += data.value;
        });
        this.coinGroup.add(coin);
    }

    private getCheapestAnimalCost(): number {
        let cheapest = Infinity;
        for (const animal of Object.values(ANIMAL_DATA)) {
            if (animal.unlockLevel <= this.level && animal.cost < cheapest) {
                cheapest = animal.cost;
            }
        }
        return cheapest;
    }
}
