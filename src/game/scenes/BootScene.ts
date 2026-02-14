import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create(): void {
        this.generatePlaceholderTextures();
        this.scene.start('PreloadScene');
    }

    private generatePlaceholderTextures(): void {
        // Animals
        this.makeRect('animal_gecko', 32, 32, 0x22c55e);
        this.makeRect('animal_frog', 32, 32, 0x3b82f6);
        this.makeRect('animal_chameleon', 48, 48, 0xa855f7);
        this.makeRect('animal_salamander', 48, 48, 0x1e1e1e);
        this.makeRect('animal_dragon', 64, 64, 0xd4a574);

        // Food
        this.makeRect('food_cricket', 16, 16, 0x8b4513);
        this.makeRect('food_mealworm', 16, 16, 0xd2b48c);
        this.makeRect('food_roach', 16, 16, 0x3d2b1f);

        // Coin (circle)
        this.makeCircle('coin', 16, 0xfbbf24);

        // Poacher
        this.makeRect('poacher_hand', 64, 64, 0xef4444);

        // Egg piece
        this.makeRect('egg_piece', 24, 24, 0xffffff);
        this.makeRect('egg_piece_empty', 24, 24, 0x4a4a4a);

        // Thought bubble
        this.makeCircle('thought_bubble', 32, 0xffffff);

        // Terrarium background
        const bgGfx = this.make.graphics({ x: 0, y: 0 });
        // Sky gradient
        for (let y = 0; y < GAME_HEIGHT; y++) {
            const t = y / GAME_HEIGHT;
            const r = Math.round(26 + t * 40);
            const g = Math.round(60 + t * 60);
            const b = Math.round(30 + t * 20);
            bgGfx.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            bgGfx.fillRect(0, y, GAME_WIDTH, 1);
        }
        // Substrate floor
        const substrateTop = Math.round(GAME_HEIGHT * 0.4);
        bgGfx.fillStyle(0x5c4033);
        bgGfx.fillRect(0, substrateTop, GAME_WIDTH, GAME_HEIGHT - substrateTop);
        // Glass walls
        bgGfx.lineStyle(4, 0x88cccc, 0.3);
        bgGfx.strokeRect(2, 2, GAME_WIDTH - 4, GAME_HEIGHT - 4);
        bgGfx.generateTexture('terrarium_bg', GAME_WIDTH, GAME_HEIGHT);
        bgGfx.destroy();

        // Helper pets (8 different colors)
        const helperColors = [
            { key: 'helper_tortoise', color: 0x6b8e23 },
            { key: 'helper_hermit_crab', color: 0xcd853f },
            { key: 'helper_mantis', color: 0x00ff7f },
            { key: 'helper_snail', color: 0xdaa520 },
            { key: 'helper_beetle', color: 0x2f4f4f },
            { key: 'helper_scorpion', color: 0x8b0000 },
            { key: 'helper_snake', color: 0x228b22 },
            { key: 'helper_millipede', color: 0x8b4513 },
        ];
        for (const { key, color } of helperColors) {
            this.makeRect(key, 32, 32, color);
        }

        // Shop bar background
        const shopGfx = this.make.graphics({ x: 0, y: 0 });
        shopGfx.fillStyle(0x000000, 0.7);
        shopGfx.fillRect(0, 0, GAME_WIDTH, 100);
        shopGfx.generateTexture('shop_bar_bg', GAME_WIDTH, 100);
        shopGfx.destroy();

        // Shop button frame
        this.makeRect('shop_button', 64, 64, 0x4a3728);
    }

    private makeRect(key: string, w: number, h: number, color: number): void {
        const gfx = this.make.graphics({ x: 0, y: 0 });
        gfx.fillStyle(color);
        gfx.fillRect(0, 0, w, h);
        gfx.lineStyle(1, 0x000000, 0.5);
        gfx.strokeRect(0, 0, w, h);
        gfx.generateTexture(key, w, h);
        gfx.destroy();
    }

    private makeCircle(key: string, diameter: number, color: number): void {
        const gfx = this.make.graphics({ x: 0, y: 0 });
        const r = diameter / 2;
        gfx.fillStyle(color);
        gfx.fillCircle(r, r, r);
        gfx.generateTexture(key, diameter, diameter);
        gfx.destroy();
    }
}
