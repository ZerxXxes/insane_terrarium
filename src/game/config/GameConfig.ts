import Phaser from 'phaser';

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;
export const SHOP_BAR_HEIGHT = 100;
export const SUBSTRATE_TOP = Math.round(GAME_HEIGHT * 0.4);
export const SUBSTRATE_BOTTOM = GAME_HEIGHT - SHOP_BAR_HEIGHT;

export function createGameConfig(parent: string, scenes: Phaser.Types.Scenes.SceneType[]): Phaser.Types.Core.GameConfig {
    return {
        type: Phaser.AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        parent,
        backgroundColor: '#1a1a2e',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false,
            },
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: scenes,
    };
}
