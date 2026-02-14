import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

const TOTAL_LEVELS = 5;

export class WinScene extends Phaser.Scene {
    private level: number = 1;

    constructor() {
        super('WinScene');
    }

    init(data: { level?: number }): void {
        this.level = data.level ?? 1;
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        const isFinalLevel = this.level >= TOTAL_LEVELS;
        const title = isFinalLevel ? 'You Win!' : 'Level Complete!';

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, title, {
            fontSize: '48px',
            color: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        if (isFinalLevel) {
            this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'All levels completed!\nThanks for playing!', {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center',
            }).setOrigin(0.5);

            const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, 'Main Menu', {
                fontSize: '28px',
                color: '#ffffff',
                backgroundColor: '#22c55e',
                padding: { x: 24, y: 12 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
        } else {
            const continueBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'Continue', {
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#22c55e',
                padding: { x: 24, y: 12 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            continueBtn.on('pointerdown', () => {
                this.scene.start('ShopScene', { level: this.level + 1 });
            });
        }
    }
}
