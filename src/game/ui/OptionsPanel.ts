import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

export const TERRARIUM_STYLES = ['tropical', 'desert', 'rainforest'] as const;
export type TerrariumStyle = typeof TERRARIUM_STYLES[number];

const STYLE_LABELS: Record<TerrariumStyle, string> = {
    tropical: 'Tropical',
    desert: 'Desert',
    rainforest: 'Rainforest',
};

export function getSelectedStyle(): TerrariumStyle {
    const stored = localStorage.getItem('terrariumStyle');
    if (stored && TERRARIUM_STYLES.includes(stored as TerrariumStyle)) {
        return stored as TerrariumStyle;
    }
    return 'tropical';
}

export function getBackgroundKey(style?: TerrariumStyle): string {
    return `terrarium_${style ?? getSelectedStyle()}`;
}

export class OptionsPanel extends Phaser.GameObjects.Container {
    private onClose: () => void;
    private onStyleChanged: (style: TerrariumStyle) => void;
    private selectionBorders: Map<TerrariumStyle, Phaser.GameObjects.Graphics> = new Map();

    constructor(
        scene: Phaser.Scene,
        onClose: () => void,
        onStyleChanged: (style: TerrariumStyle) => void,
    ) {
        super(scene, 0, 0);
        this.onClose = onClose;
        this.onStyleChanged = onStyleChanged;
        this.setDepth(100);
        scene.add.existing(this);
        this.build();
    }

    private build(): void {
        // Dimmed backdrop (click to close)
        const backdrop = this.scene.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0x000000, 0.6,
        ).setInteractive({ useHandCursor: true });
        backdrop.on('pointerdown', () => this.close());
        this.add(backdrop);

        // Panel background
        const panelW = 700;
        const panelH = 420;
        const panelX = GAME_WIDTH / 2;
        const panelY = GAME_HEIGHT / 2;

        const panel = this.scene.add.graphics();
        panel.fillStyle(0x1a1a2e, 0.95);
        panel.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 16);
        panel.lineStyle(2, 0x22c55e);
        panel.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 16);
        this.add(panel);

        // Stop clicks on panel from closing
        const panelHitArea = this.scene.add.rectangle(panelX, panelY, panelW, panelH, 0x000000, 0)
            .setInteractive();
        this.add(panelHitArea);

        // Title
        const title = this.scene.add.text(panelX, panelY - panelH / 2 + 40, 'Choose Terrarium', {
            fontSize: '28px',
            color: '#22c55e',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add(title);

        // Thumbnail previews
        const thumbW = 192;
        const thumbH = 144;
        const spacing = 20;
        const totalW = TERRARIUM_STYLES.length * thumbW + (TERRARIUM_STYLES.length - 1) * spacing;
        const startX = panelX - totalW / 2 + thumbW / 2;
        const thumbY = panelY + 10;

        const currentStyle = getSelectedStyle();

        for (let i = 0; i < TERRARIUM_STYLES.length; i++) {
            const style = TERRARIUM_STYLES[i];
            const x = startX + i * (thumbW + spacing);

            // Thumbnail image
            const thumb = this.scene.add.image(x, thumbY, `terrarium_${style}`)
                .setDisplaySize(thumbW, thumbH)
                .setInteractive({ useHandCursor: true });
            this.add(thumb);

            // Selection border
            const border = this.scene.add.graphics();
            this.drawBorder(border, x, thumbY, thumbW, thumbH, style === currentStyle);
            this.add(border);
            this.selectionBorders.set(style, border);

            // Label
            const label = this.scene.add.text(x, thumbY + thumbH / 2 + 20, STYLE_LABELS[style], {
                fontSize: '18px',
                color: '#ffffff',
            }).setOrigin(0.5);
            this.add(label);

            // Click handler
            thumb.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                pointer.event.stopPropagation();
                this.selectStyle(style);
            });

            thumb.on('pointerover', () => {
                if (style !== getSelectedStyle()) {
                    thumb.setAlpha(0.8);
                }
            });
            thumb.on('pointerout', () => {
                thumb.setAlpha(1);
            });
        }

        // Close button
        const closeBtn = this.scene.add.text(panelX, panelY + panelH / 2 - 40, 'Close', {
            fontSize: '22px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerover', () => closeBtn.setStyle({ backgroundColor: '#666666' }));
        closeBtn.on('pointerout', () => closeBtn.setStyle({ backgroundColor: '#444444' }));
        closeBtn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
            this.close();
        });
        this.add(closeBtn);
    }

    private drawBorder(
        gfx: Phaser.GameObjects.Graphics,
        x: number, y: number,
        w: number, h: number,
        selected: boolean,
    ): void {
        gfx.clear();
        if (selected) {
            gfx.lineStyle(3, 0x22c55e);
        } else {
            gfx.lineStyle(1, 0x666666);
        }
        gfx.strokeRect(x - w / 2, y - h / 2, w, h);
    }

    private selectStyle(style: TerrariumStyle): void {
        localStorage.setItem('terrariumStyle', style);

        // Update all borders
        for (const [s, border] of this.selectionBorders) {
            const idx = TERRARIUM_STYLES.indexOf(s);
            const thumbW = 192;
            const thumbH = 144;
            const spacing = 20;
            const totalW = TERRARIUM_STYLES.length * thumbW + (TERRARIUM_STYLES.length - 1) * spacing;
            const startX = GAME_WIDTH / 2 - totalW / 2 + thumbW / 2;
            const x = startX + idx * (thumbW + spacing);
            const y = GAME_HEIGHT / 2 + 10;
            this.drawBorder(border, x, y, thumbW, thumbH, s === style);
        }

        this.onStyleChanged(style);
    }

    private close(): void {
        this.destroy();
        this.onClose();
    }
}
