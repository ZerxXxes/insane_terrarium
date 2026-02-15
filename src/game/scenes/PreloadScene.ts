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

        // Backgrounds (hi-res 2048x1536)
        this.load.image('terrarium_tropical', 'assets/backgrounds/terrarium_tropical.png');
        this.load.image('terrarium_desert', 'assets/backgrounds/terrarium_desert.png');
        this.load.image('terrarium_rainforest', 'assets/backgrounds/terrarium_rainforest.png');

        // Animals
        this.load.image('animal_gecko', 'assets/sprites/animal_gecko.png');
        this.load.image('animal_frog', 'assets/sprites/animal_frog.png');
        this.load.image('animal_chameleon', 'assets/sprites/animal_chameleon.png');
        this.load.image('animal_salamander', 'assets/sprites/animal_salamander.png');
        this.load.image('animal_dragon', 'assets/sprites/animal_dragon.png');

        // Animal walk frames
        this.load.image('animal_gecko_walk', 'assets/sprites/animal_gecko_walk.png');
        this.load.image('animal_frog_walk', 'assets/sprites/animal_frog_walk.png');
        this.load.image('animal_chameleon_walk', 'assets/sprites/animal_chameleon_walk.png');
        this.load.image('animal_salamander_walk', 'assets/sprites/animal_salamander_walk.png');
        this.load.image('animal_dragon_walk', 'assets/sprites/animal_dragon_walk.png');

        // Baby animals (idle + walk)
        this.load.image('baby_gecko', 'assets/sprites/baby_gecko.png');
        this.load.image('baby_gecko_walk', 'assets/sprites/baby_gecko_walk.png');
        this.load.image('baby_frog', 'assets/sprites/baby_frog.png');
        this.load.image('baby_frog_walk', 'assets/sprites/baby_frog_walk.png');
        this.load.image('baby_chameleon', 'assets/sprites/baby_chameleon.png');
        this.load.image('baby_chameleon_walk', 'assets/sprites/baby_chameleon_walk.png');
        this.load.image('baby_salamander', 'assets/sprites/baby_salamander.png');
        this.load.image('baby_salamander_walk', 'assets/sprites/baby_salamander_walk.png');
        this.load.image('baby_dragon', 'assets/sprites/baby_dragon.png');
        this.load.image('baby_dragon_walk', 'assets/sprites/baby_dragon_walk.png');

        // Coin animation frames
        this.load.image('coin_flip', 'assets/sprites/coin_flip.png');
        this.load.image('coin_bronze', 'assets/sprites/coin_bronze.png');
        this.load.image('coin_bronze_flip', 'assets/sprites/coin_bronze_flip.png');
        this.load.image('coin_silver', 'assets/sprites/coin_silver.png');
        this.load.image('coin_silver_flip', 'assets/sprites/coin_silver_flip.png');

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

        // Helper pet walk frames
        this.load.image('helper_tortoise_walk', 'assets/sprites/helper_tortoise_walk.png');
        this.load.image('helper_hermit_crab_walk', 'assets/sprites/helper_hermit_crab_walk.png');
        this.load.image('helper_mantis_walk', 'assets/sprites/helper_mantis_walk.png');
        this.load.image('helper_snail_walk', 'assets/sprites/helper_snail_walk.png');
        this.load.image('helper_beetle_walk', 'assets/sprites/helper_beetle_walk.png');
        this.load.image('helper_scorpion_walk', 'assets/sprites/helper_scorpion_walk.png');
        this.load.image('helper_snake_walk', 'assets/sprites/helper_snake_walk.png');
        this.load.image('helper_millipede_walk', 'assets/sprites/helper_millipede_walk.png');

        // UI
        this.load.image('shop_button', 'assets/ui/shop_button.png');
    }

    create(): void {
        this.createAnimations();
        this.scene.start('MenuScene');
    }

    private createAnimations(): void {
        // Animal walk animations (2-frame cycles using individual images)
        const animals = ['gecko', 'frog', 'chameleon', 'salamander', 'dragon'];
        for (const name of animals) {
            const key = `animal_${name}`;
            this.anims.create({
                key: `${key}_walk`,
                frames: [
                    { key: key },
                    { key: `${key}_walk` },
                ],
                frameRate: 4,
                repeat: -1,
            });
            this.anims.create({
                key: `${key}_idle`,
                frames: [{ key: key }],
                frameRate: 1,
                repeat: -1,
            });
        }

        // Baby animal walk/idle animations (same 2-frame pattern)
        for (const name of animals) {
            const key = `baby_${name}`;
            this.anims.create({
                key: `${key}_walk`,
                frames: [
                    { key: key },
                    { key: `${key}_walk` },
                ],
                frameRate: 4,
                repeat: -1,
            });
            this.anims.create({
                key: `${key}_idle`,
                frames: [{ key: key }],
                frameRate: 1,
                repeat: -1,
            });
        }

        // Helper pet walk/idle animations (same 2-frame pattern)
        const helpers = ['tortoise', 'hermit_crab', 'mantis', 'snail', 'beetle', 'scorpion', 'snake', 'millipede'];
        for (const name of helpers) {
            const key = `helper_${name}`;
            this.anims.create({
                key: `${key}_walk`,
                frames: [
                    { key: key },
                    { key: `${key}_walk` },
                ],
                frameRate: 4,
                repeat: -1,
            });
            this.anims.create({
                key: `${key}_idle`,
                frames: [{ key: key }],
                frameRate: 1,
                repeat: -1,
            });
        }

        // Coin spin animations (gold, bronze, silver)
        this.anims.create({
            key: 'coin_spin',
            frames: [
                { key: 'coin' },
                { key: 'coin_flip' },
            ],
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'coin_bronze_spin',
            frames: [
                { key: 'coin_bronze' },
                { key: 'coin_bronze_flip' },
            ],
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'coin_silver_spin',
            frames: [
                { key: 'coin_silver' },
                { key: 'coin_silver_flip' },
            ],
            frameRate: 4,
            repeat: -1,
        });
    }
}
