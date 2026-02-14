import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

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

        this.add.text(GAME_WIDTH / 2, 80, 'Pick a Helper Pet', {
            fontSize: '36px',
            color: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);

        // Two placeholder pet options
        const petOptions = [
            { key: 'helper_tortoise', name: 'Tortoise', role: 'Auto-feeder', x: GAME_WIDTH / 3 },
            { key: 'helper_hermit_crab', name: 'Hermit Crab', role: 'Coin collector', x: (GAME_WIDTH / 3) * 2 },
        ];

        for (const pet of petOptions) {
            const container = this.add.container(pet.x, GAME_HEIGHT / 2);

            const sprite = this.add.image(0, -40, pet.key).setScale(2);
            const nameText = this.add.text(0, 20, pet.name, {
                fontSize: '22px',
                color: '#ffffff',
                fontStyle: 'bold',
            }).setOrigin(0.5);
            const roleText = this.add.text(0, 48, pet.role, {
                fontSize: '16px',
                color: '#aaaaaa',
            }).setOrigin(0.5);

            const pickBtn = this.add.text(0, 90, 'Pick', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#22c55e',
                padding: { x: 20, y: 8 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            pickBtn.on('pointerdown', () => {
                this.scene.start('GameScene', { level: this.nextLevel });
            });

            container.add([sprite, nameText, roleText, pickBtn]);
        }
    }
}
