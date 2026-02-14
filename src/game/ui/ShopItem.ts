import Phaser from 'phaser';

export interface ShopItemConfig {
    spriteKey: string;
    label: string;
    price: number;
    id: string;
}

export class ShopItem extends Phaser.GameObjects.Container {
    private bg: Phaser.GameObjects.Image;
    private priceText: Phaser.GameObjects.Text;
    private itemId: string;
    readonly price: number;
    private _enabled: boolean = true;
    private purchased: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, config: ShopItemConfig) {
        super(scene, x, y);

        this.itemId = config.id;
        this.price = config.price;

        // Button background
        this.bg = scene.add.image(0, 0, 'shop_button').setScale(1.1);

        // Item sprite
        const sprite = scene.add.image(0, -8, config.spriteKey).setScale(0.8);

        // Price text
        this.priceText = scene.add.text(0, 24, `${config.price}`, {
            fontSize: '12px',
            color: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1,
        }).setOrigin(0.5);

        // Label (small, above icon)
        const label = scene.add.text(0, -38, config.label, {
            fontSize: '9px',
            color: '#cccccc',
        }).setOrigin(0.5);

        this.add([this.bg, sprite, this.priceText, label]);
        this.setSize(70, 80);
        this.setInteractive({ useHandCursor: true });
        this.setDepth(95);

        this.on('pointerover', () => {
            if (this._enabled && !this.purchased) this.bg.setTint(0x666666);
        });
        this.on('pointerout', () => {
            this.bg.clearTint();
        });
        this.on('pointerdown', () => {
            if (this._enabled && !this.purchased) {
                this.emit('purchase', this.itemId, this.price);
            }
        });

        scene.add.existing(this);
    }

    setEnabled(enabled: boolean): void {
        this._enabled = enabled;
        this.setAlpha(enabled && !this.purchased ? 1 : 0.4);
    }

    markPurchased(): void {
        this.purchased = true;
        this.priceText.setText('✓');
        this.priceText.setColor('#22c55e');
        this.setAlpha(0.5);
    }
}
