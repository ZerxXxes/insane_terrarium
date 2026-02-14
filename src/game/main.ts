import Phaser from 'phaser';
import { createGameConfig } from './config/GameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { WinScene } from './scenes/WinScene';
import { GameOverScene } from './scenes/GameOverScene';
import { ShopScene } from './scenes/ShopScene';

export function StartGame(parent: string): Phaser.Game {
    const config = createGameConfig(parent, [
        BootScene,
        PreloadScene,
        MenuScene,
        GameScene,
        ShopScene,
        WinScene,
        GameOverScene,
    ]);

    return new Phaser.Game(config);
}
