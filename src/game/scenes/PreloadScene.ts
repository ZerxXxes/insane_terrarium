import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    create(): void {
        // Show loading bar
        const barWidth = 400;
        const barHeight = 30;
        const x = (GAME_WIDTH - barWidth) / 2;
        const y = GAME_HEIGHT / 2;

        const bg = this.add.graphics();
        bg.fillStyle(0x333333);
        bg.fillRect(x, y, barWidth, barHeight);

        const fill = this.add.graphics();
        fill.fillStyle(0x22c55e);
        fill.fillRect(x + 2, y + 2, barWidth - 4, barHeight - 4);

        const loadingText = this.add.text(GAME_WIDTH / 2, y - 30, 'Loading...', {
            fontSize: '20px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Since we're using generated textures (no actual file loading),
        // just show the bar briefly then move on
        this.time.delayedCall(300, () => {
            bg.destroy();
            fill.destroy();
            loadingText.destroy();
            this.scene.start('MenuScene');
        });
    }
}
