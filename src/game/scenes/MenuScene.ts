import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create(): void {
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'terrarium_bg');

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, 'Insane Terrarium', {
            fontSize: '48px',
            color: '#22c55e',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        const startBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'Start Game', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#22c55e',
            padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#16a34a' }));
        startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#22c55e' }));
        startBtn.on('pointerdown', () => {
            this.scene.start('GameScene', { level: 1 });
        });
    }
}
