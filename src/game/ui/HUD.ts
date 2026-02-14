import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/GameConfig';
import { EconomyManager } from '../managers/EconomyManager';

export class HUD {
    private scene: Phaser.Scene;
    private economy: EconomyManager;
    private coinText!: Phaser.GameObjects.Text;
    private eggSlots: Phaser.GameObjects.Image[] = [];
    private levelText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, economy: EconomyManager, level: number) {
        this.scene = scene;
        this.economy = economy;

        this.createCoinCounter();
        this.createEggProgress();
        this.createLevelIndicator(level);

        // Listen for economy changes
        economy.on('coinsChanged', () => this.updateCoinDisplay());
        economy.on('eggPieceBought', (index: number) => this.updateEggSlot(index));
    }

    private createCoinCounter(): void {
        this.scene.add.image(30, 20, 'coin').setDepth(100).setScale(0.05);
        this.coinText = this.scene.add.text(48, 12, `${this.economy.coins}`, {
            fontSize: '22px',
            color: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        }).setDepth(100);
    }

    private createEggProgress(): void {
        const startX = GAME_WIDTH - 100;
        for (let i = 0; i < 3; i++) {
            const slot = this.scene.add.image(
                startX + i * 30,
                20,
                this.economy.eggPiecesBought[i] ? 'egg_piece' : 'egg_piece_empty'
            ).setDepth(100).setScale(0.05);
            this.eggSlots.push(slot);
        }
    }

    private createLevelIndicator(level: number): void {
        this.levelText = this.scene.add.text(GAME_WIDTH / 2, 20, `Level ${level}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5, 0).setDepth(100);
    }

    private updateCoinDisplay(): void {
        this.coinText.setText(`${this.economy.coins}`);
    }

    private updateEggSlot(index: number): void {
        if (this.eggSlots[index]) {
            this.eggSlots[index].setTexture('egg_piece');
            // Pulse animation
            this.scene.tweens.add({
                targets: this.eggSlots[index],
                scaleX: 0.07,
                scaleY: 0.07,
                yoyo: true,
                duration: 200,
            });
        }
    }
}
