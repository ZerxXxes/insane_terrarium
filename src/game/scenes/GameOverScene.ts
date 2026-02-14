import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#1a0000');

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, 'Game Over', {
            fontSize: '48px',
            color: '#ef4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'All your animals have perished...', {
            fontSize: '20px',
            color: '#cccccc',
        }).setOrigin(0.5);

        const restartBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, 'Restart', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#ef4444',
            padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}
