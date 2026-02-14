import Phaser from 'phaser';
import { getLevelConfig, LevelConfig } from '../config/LevelData';
import { ANIMAL_DATA } from '../config/AnimalData';
import { EconomyManager } from './EconomyManager';

const TOTAL_LEVELS = 5;

export class LevelManager {
    private scene: Phaser.Scene;
    private economy: EconomyManager;
    private level: number;
    private config: LevelConfig;
    private gameOverTriggered: boolean = false;
    private winTriggered: boolean = false;

    constructor(scene: Phaser.Scene, economy: EconomyManager, level: number) {
        this.scene = scene;
        this.economy = economy;
        this.level = level;
        this.config = getLevelConfig(level);

        // Listen for egg purchases
        economy.on('eggPieceBought', () => this.checkWin());
    }

    get levelConfig(): LevelConfig {
        return this.config;
    }

    forceWin(): void {
        if (this.winTriggered) return;
        this.winTriggered = true;
        this.scene.scene.start('WinScene', { level: this.level });
    }

    checkWin(): void {
        if (this.winTriggered) return;
        if (this.economy.allEggsBought) {
            this.winTriggered = true;
            this.scene.time.delayedCall(500, () => {
                if (this.level >= TOTAL_LEVELS) {
                    this.scene.scene.start('WinScene', { level: this.level });
                } else {
                    this.scene.scene.start('WinScene', { level: this.level });
                }
            });
        }
    }

    checkGameOver(animalCount: number): void {
        if (this.gameOverTriggered || this.winTriggered) return;
        if (animalCount > 0) return;

        const cheapest = this.getCheapestAnimalCost();
        if (this.economy.coins < cheapest) {
            this.gameOverTriggered = true;
            this.scene.time.delayedCall(1000, () => {
                this.scene.scene.start('GameOverScene');
            });
        }
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
