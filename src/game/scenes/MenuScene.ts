import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';
import { HelperManager } from '../managers/HelperManager';
import { OptionsPanel, getBackgroundKey, TerrariumStyle } from '../ui/OptionsPanel';

export class MenuScene extends Phaser.Scene {
    private bg!: Phaser.GameObjects.Image;
    private optionsPanel: OptionsPanel | null = null;

    constructor() {
        super('MenuScene');
    }

    create(): void {
        this.bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, getBackgroundKey())
            .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

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
            new HelperManager(this.game).reset();
            this.scene.start('GameScene', { level: 1 });
        });

        const optionsBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 'Options', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#22c55e',
            padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        optionsBtn.on('pointerover', () => optionsBtn.setStyle({ backgroundColor: '#16a34a' }));
        optionsBtn.on('pointerout', () => optionsBtn.setStyle({ backgroundColor: '#22c55e' }));
        optionsBtn.on('pointerdown', () => {
            if (this.optionsPanel) return;
            this.optionsPanel = new OptionsPanel(
                this,
                () => { this.optionsPanel = null; },
                (style: TerrariumStyle) => {
                    this.bg.setTexture(`terrarium_${style}`);
                    this.bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
                },
            );
        });
    }
}
