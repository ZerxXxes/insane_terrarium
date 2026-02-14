import Phaser from 'phaser';

export class HealthBar extends Phaser.GameObjects.Container {
    private bg: Phaser.GameObjects.Graphics;
    private fill: Phaser.GameObjects.Graphics;
    private barWidth: number;
    private barHeight: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 40, height: number = 6) {
        super(scene, x, y);

        this.barWidth = width;
        this.barHeight = height;

        this.bg = scene.add.graphics();
        this.bg.fillStyle(0x333333);
        this.bg.fillRect(-width / 2, -height / 2, width, height);

        this.fill = scene.add.graphics();

        this.add([this.bg, this.fill]);
        this.setDepth(60);

        scene.add.existing(this);
    }

    updateBar(percent: number): void {
        this.fill.clear();
        const color = percent > 0.5 ? 0x22c55e : percent > 0.25 ? 0xfbbf24 : 0xef4444;
        this.fill.fillStyle(color);
        this.fill.fillRect(
            -this.barWidth / 2 + 1,
            -this.barHeight / 2 + 1,
            (this.barWidth - 2) * Math.max(0, percent),
            this.barHeight - 2
        );
    }
}
