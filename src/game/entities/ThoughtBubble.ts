import Phaser from 'phaser';

export class ThoughtBubble extends Phaser.GameObjects.Container {
    private bobOffset: number = 0;
    private baseOffsetY: number;
    private pulseTween: Phaser.Tweens.Tween | null = null;

    constructor(scene: Phaser.Scene, parentHeight: number) {
        super(scene, 0, 0);

        this.baseOffsetY = -(parentHeight / 2 + 24);

        const bubble = scene.add.image(0, 0, 'thought_bubble').setScale(0.06);
        const icon = scene.add.image(0, 0, 'food_cricket').setScale(0.03);

        this.add([bubble, icon]);
        this.setVisible(false);
        this.setDepth(50);

        scene.add.existing(this);
    }

    show(): void {
        if (this.visible) return;
        this.setVisible(true);

        // Urgent pulse animation
        this.pulseTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    hide(): void {
        if (!this.visible) return;
        this.setVisible(false);
        if (this.pulseTween) {
            this.pulseTween.destroy();
            this.pulseTween = null;
            this.setScale(1);
        }
    }

    updateParentHeight(parentHeight: number): void {
        this.baseOffsetY = -(parentHeight / 2 + 24);
    }

    updatePosition(parentX: number, parentY: number, delta: number): void {
        if (!this.visible) return;

        this.bobOffset += delta * 0.003;
        const bob = Math.sin(this.bobOffset) * 3;

        this.setPosition(parentX, parentY + this.baseOffsetY + bob);
    }
}
