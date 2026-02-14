import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';
import { HelperManager } from '../managers/HelperManager';
import { HelperPetConfig } from '../config/HelperPetData';

export class ShopScene extends Phaser.Scene {
    private nextLevel: number = 2;

    constructor() {
        super('ShopScene');
    }

    init(data: { level?: number }): void {
        this.nextLevel = data.level ?? 2;
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        const helperManager = new HelperManager(this.game);
        const pair = helperManager.getRandomUnownedPair();

        this.add.text(GAME_WIDTH / 2, 60, 'Pick a Helper Pet', {
            fontSize: '36px',
            color: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 110, `Starting Level ${this.nextLevel}`, {
            fontSize: '18px',
            color: '#aaaaaa',
        }).setOrigin(0.5);

        if (!pair) {
            // All pets owned — skip to next level
            this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'You have all helper pets!', {
                fontSize: '24px',
                color: '#ffffff',
            }).setOrigin(0.5);

            this.time.delayedCall(1500, () => {
                this.scene.start('GameScene', { level: this.nextLevel });
            });
            return;
        }

        const positions = [GAME_WIDTH / 3, (GAME_WIDTH / 3) * 2];

        pair.forEach((petConfig: HelperPetConfig, i: number) => {
            const x = positions[i];
            const y = GAME_HEIGHT / 2 - 20;

            // Pet sprite
            this.add.image(x, y - 60, petConfig.spriteKey).setScale(2.5);

            // Name
            this.add.text(x, y + 10, petConfig.name, {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            }).setOrigin(0.5);

            // Role
            this.add.text(x, y + 40, petConfig.role, {
                fontSize: '18px',
                color: '#fbbf24',
            }).setOrigin(0.5);

            // Description
            this.add.text(x, y + 70, petConfig.description, {
                fontSize: '14px',
                color: '#aaaaaa',
                wordWrap: { width: 250 },
                align: 'center',
            }).setOrigin(0.5);

            // Pick button
            const pickBtn = this.add.text(x, y + 120, 'Pick', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#22c55e',
                padding: { x: 28, y: 10 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            pickBtn.on('pointerover', () => pickBtn.setStyle({ backgroundColor: '#16a34a' }));
            pickBtn.on('pointerout', () => pickBtn.setStyle({ backgroundColor: '#22c55e' }));
            pickBtn.on('pointerdown', () => {
                helperManager.addPet(petConfig.key);
                this.scene.start('GameScene', { level: this.nextLevel });
            });
        });
    }
}
