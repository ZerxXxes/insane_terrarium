import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload(): void {
        // Loading bar
        const barWidth = 400;
        const barHeight = 30;
        const x = (GAME_WIDTH - barWidth) / 2;
        const y = GAME_HEIGHT / 2;

        const bg = this.add.graphics();
        bg.fillStyle(0x333333);
        bg.fillRect(x, y, barWidth, barHeight);

        const fill = this.add.graphics();
        const loadingText = this.add.text(GAME_WIDTH / 2, y - 30, 'Loading...', {
            fontSize: '20px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.load.on('progress', (value: number) => {
            fill.clear();
            fill.fillStyle(0x22c55e);
            fill.fillRect(x + 2, y + 2, (barWidth - 4) * value, barHeight - 4);
            loadingText.setText(`Loading... ${Math.round(value * 100)}%`);
        });

        // Background
        this.load.image('terrarium_bg', 'assets/backgrounds/terrarium_bg.png');

        // Animals
        this.load.image('animal_gecko', 'assets/sprites/animal_gecko.png');
        this.load.image('animal_frog', 'assets/sprites/animal_frog.png');
        this.load.image('animal_chameleon', 'assets/sprites/animal_chameleon.png');
        this.load.image('animal_salamander', 'assets/sprites/animal_salamander.png');
        this.load.image('animal_dragon', 'assets/sprites/animal_dragon.png');

        // Food
        this.load.image('food_cricket', 'assets/sprites/food_cricket.png');
        this.load.image('food_mealworm', 'assets/sprites/food_mealworm.png');
        this.load.image('food_roach', 'assets/sprites/food_roach.png');

        // Coin, eggs, poacher, thought bubble
        this.load.image('coin', 'assets/sprites/coin.png');
        this.load.image('egg_piece', 'assets/sprites/egg_piece.png');
        this.load.image('egg_piece_empty', 'assets/sprites/egg_piece_empty.png');
        this.load.image('poacher_hand', 'assets/sprites/poacher_hand.png');
        this.load.image('thought_bubble', 'assets/sprites/thought_bubble.png');

        // Helper pets
        this.load.image('helper_tortoise', 'assets/sprites/helper_tortoise.png');
        this.load.image('helper_hermit_crab', 'assets/sprites/helper_hermit_crab.png');
        this.load.image('helper_mantis', 'assets/sprites/helper_mantis.png');
        this.load.image('helper_snail', 'assets/sprites/helper_snail.png');
        this.load.image('helper_beetle', 'assets/sprites/helper_beetle.png');
        this.load.image('helper_scorpion', 'assets/sprites/helper_scorpion.png');
        this.load.image('helper_snake', 'assets/sprites/helper_snake.png');
        this.load.image('helper_millipede', 'assets/sprites/helper_millipede.png');

        // UI
        this.load.image('shop_button', 'assets/ui/shop_button.png');
    }

    create(): void {
        this.scene.start('MenuScene');
    }
}
