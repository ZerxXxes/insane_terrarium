import Phaser from 'phaser';

export class ThoughtBubble extends Phaser.GameObjects.Container {
    private bobOffset: number = 0;
    private baseOffsetY: number;

    constructor(scene: Phaser.Scene, parentHeight: number) {
        super(scene, 0, 0);

        this.baseOffsetY = -(parentHeight / 2 + 24);

        const bubble = scene.add.image(0, 0, 'thought_bubble').setScale(0.8);
        const icon = scene.add.image(0, 0, 'food_cricket').setScale(0.6);

        this.add([bubble, icon]);
        this.setVisible(false);
        this.setDepth(50);

        scene.add.existing(this);
    }

    show(): void {
        this.setVisible(true);
    }

    hide(): void {
        this.setVisible(false);
    }

    updatePosition(parentX: number, parentY: number, delta: number): void {
        if (!this.visible) return;

        this.bobOffset += delta * 0.003;
        const bob = Math.sin(this.bobOffset) * 3;

        this.setPosition(parentX, parentY + this.baseOffsetY + bob);
    }
}
