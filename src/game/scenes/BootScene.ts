import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/GameConfig';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create(): void {
        // Generate programmatic textures that aren't loaded from files
        this.generateProgrammaticTextures();
        this.scene.start('PreloadScene');
    }

    private generateProgrammaticTextures(): void {
        // Shop bar background (semi-transparent, better as programmatic)
        const shopGfx = this.make.graphics({ x: 0, y: 0 });
        shopGfx.fillStyle(0x000000, 0.7);
        shopGfx.fillRect(0, 0, GAME_WIDTH, 100);
        shopGfx.generateTexture('shop_bar_bg', GAME_WIDTH, 100);
        shopGfx.destroy();
    }
}
