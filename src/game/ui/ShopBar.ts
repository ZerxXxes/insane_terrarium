import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SHOP_BAR_HEIGHT } from '../config/GameConfig';
import { ANIMAL_DATA } from '../config/AnimalData';
import { FOOD_DATA } from '../config/FoodData';
import { getLevelConfig } from '../config/LevelData';
import { EconomyManager } from '../managers/EconomyManager';
import { ShopItem } from './ShopItem';

export class ShopBar {
    private scene: Phaser.Scene;
    private economy: EconomyManager;
    private level: number;
    private items: ShopItem[] = [];
    private eggItems: ShopItem[] = [];

    constructor(scene: Phaser.Scene, economy: EconomyManager, level: number) {
        this.scene = scene;
        this.economy = economy;
        this.level = level;

        // Background
        scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT - SHOP_BAR_HEIGHT / 2, 'shop_bar_bg').setDepth(90);

        this.createAnimalItems();
        this.createFoodItems();
        this.createEggItems();

        // Update affordability when coins change
        economy.on('coinsChanged', () => this.updateAffordability());
        this.updateAffordability();
    }

    private createAnimalItems(): void {
        let xOffset = 20;
        const y = GAME_HEIGHT - SHOP_BAR_HEIGHT / 2;

        for (const animal of Object.values(ANIMAL_DATA)) {
            if (animal.unlockLevel > this.level) continue;

            const item = new ShopItem(this.scene, xOffset + 35, y, {
                spriteKey: animal.spriteKey,
                label: animal.name.split(' ').pop() ?? animal.name,
                price: animal.cost,
                id: `animal_${animal.key}`,
            });

            item.on('purchase', (id: string, price: number) => {
                if (this.economy.spendCoins(price)) {
                    this.scene.events.emit('buyAnimal', animal.key);
                }
            });

            this.items.push(item);
            xOffset += 75;
        }
    }

    private createFoodItems(): void {
        let xOffset = 400;
        const y = GAME_HEIGHT - SHOP_BAR_HEIGHT / 2;

        for (const food of Object.values(FOOD_DATA)) {
            if (food.unlockLevel > this.level) continue;
            if (food.cost === 0) continue; // Skip free food (cricket) — it's the default

            const item = new ShopItem(this.scene, xOffset + 35, y, {
                spriteKey: food.spriteKey,
                label: food.name,
                price: food.cost,
                id: `food_${food.key}`,
            });

            item.on('purchase', (id: string, price: number) => {
                // Food items change the selected food type (one-time selection, not purchase)
                this.scene.events.emit('selectFood', food.key);
            });

            this.items.push(item);
            xOffset += 75;
        }
    }

    private createEggItems(): void {
        const levelConfig = getLevelConfig(this.level);
        let xOffset = GAME_WIDTH - 250;
        const y = GAME_HEIGHT - SHOP_BAR_HEIGHT / 2;

        for (let i = 0; i < 3; i++) {
            const cost = levelConfig.eggCosts[i];
            const item = new ShopItem(this.scene, xOffset + 35, y, {
                spriteKey: 'egg_piece',
                label: `Egg ${i + 1}`,
                price: cost,
                id: `egg_${i}`,
            });

            item.on('purchase', (_id: string, price: number) => {
                if (this.economy.purchaseEggPiece(i, price)) {
                    item.markPurchased();
                    this.scene.events.emit('eggBought', i);
                }
            });

            this.eggItems.push(item);
            this.items.push(item);
            xOffset += 75;
        }
    }

    private updateAffordability(): void {
        for (const item of this.items) {
            // Egg items that are already purchased stay disabled
            const isEgg = this.eggItems.includes(item);
            if (isEgg && this.economy.eggPiecesBought[this.eggItems.indexOf(item)]) {
                item.setEnabled(false);
                continue;
            }
            item.setEnabled(this.economy.canAfford(item.price));
        }
    }
}
