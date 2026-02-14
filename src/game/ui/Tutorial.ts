import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

const STEPS = [
    {
        text: 'Click anywhere in the terrarium\nto drop food for your animals!',
        event: 'foodDropped',
    },
    {
        text: 'Animals eat when hungry.\nWatch for thought bubbles!',
        event: 'animalFed',
    },
    {
        text: 'Collect coins that\nyour animals drop!',
        event: 'coinCollected',
    },
    {
        text: 'Use the shop at the bottom\nto buy animals and egg pieces\nto complete the level!',
        event: 'shopUsed',
    },
];

export class Tutorial {
    private scene: Phaser.Scene;
    private overlay: Phaser.GameObjects.Rectangle;
    private textObj: Phaser.GameObjects.Text;
    private stepIndex: number = 0;
    private active: boolean = true;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Semi-transparent overlay
        this.overlay = scene.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80,
            420, 120,
            0x000000, 0.75
        ).setDepth(200).setStrokeStyle(2, 0x22c55e);

        this.textObj = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, '', {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 6,
        }).setOrigin(0.5).setDepth(201);

        this.showStep();
        this.listenForEvents();
    }

    private showStep(): void {
        if (this.stepIndex >= STEPS.length) {
            this.complete();
            return;
        }
        const step = STEPS[this.stepIndex];
        this.textObj.setText(step.text);

        // Pulse the overlay
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: { from: 0.5, to: 0.75 },
            duration: 600,
            yoyo: true,
            repeat: 2,
        });
    }

    private listenForEvents(): void {
        // Listen for game events to advance tutorial
        this.scene.events.on('tutorialAdvance', (eventName: string) => {
            if (!this.active) return;
            if (this.stepIndex < STEPS.length && STEPS[this.stepIndex].event === eventName) {
                this.stepIndex++;
                if (this.stepIndex < STEPS.length) {
                    this.showStep();
                } else {
                    this.complete();
                }
            }
        });
    }

    private complete(): void {
        this.active = false;
        this.scene.tweens.add({
            targets: [this.overlay, this.textObj],
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.overlay.destroy();
                this.textObj.destroy();
            },
        });
    }
}
