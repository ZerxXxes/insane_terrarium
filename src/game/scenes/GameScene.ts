import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SHOP_BAR_HEIGHT, SUBSTRATE_TOP, SUBSTRATE_BOTTOM } from '../config/GameConfig';

export class GameScene extends Phaser.Scene {
    level: number = 1;

    constructor() {
        super('GameScene');
    }

    init(data: { level?: number }): void {
        this.level = data.level ?? 1;
    }

    create(): void {
        // Background
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'terrarium_bg');

        // Level indicator (temporary)
        this.add.text(GAME_WIDTH / 2, 20, `Level ${this.level}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5, 0).setDepth(100);

        // Shop bar placeholder
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT - SHOP_BAR_HEIGHT / 2, 'shop_bar_bg').setDepth(90);

        // Debug: substrate bounds visualization (subtle)
        const debugGfx = this.add.graphics();
        debugGfx.lineStyle(1, 0xffffff, 0.15);
        debugGfx.strokeRect(0, SUBSTRATE_TOP, GAME_WIDTH, SUBSTRATE_BOTTOM - SUBSTRATE_TOP);
        debugGfx.setDepth(0);
    }
}
