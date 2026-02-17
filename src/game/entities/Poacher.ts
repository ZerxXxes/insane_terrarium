import Phaser from 'phaser';
import { PoacherConfig } from '../config/LevelData';
import { GAME_WIDTH, SUBSTRATE_TOP } from '../config/GameConfig';
import { Animal } from './Animal';
import { HealthBar } from '../ui/HealthBar';

export class Poacher extends Phaser.GameObjects.Sprite {
    private clicksRemaining: number;
    private maxClicks: number;
    private speed: number;
    private target: Animal | null = null;
    private healthBar: HealthBar;
    private retreating: boolean = false;
    private grabbing: boolean = false;

    constructor(scene: Phaser.Scene, poacherConfig: PoacherConfig) {
        // Spawn from top, random x
        const x = Phaser.Math.Between(100, GAME_WIDTH - 100);
        const y = -40;

        super(scene, x, y, 'poacher_hand');

        this.maxClicks = poacherConfig.clicksToRepel;
        this.clicksRemaining = poacherConfig.clicksToRepel;
        this.speed = poacherConfig.speed;

        scene.add.existing(this);
        this.setDepth(40);
        this.setScale(0.15); // 512x768 -> ~77x115px in-game
        this.setInteractive({ useHandCursor: true });

        // Health bar above
        this.healthBar = new HealthBar(scene, x, y - 40);
        this.healthBar.updateBar(1);

        // Click to damage
        this.on('pointerdown', () => this.takeDamage());

        // Enter animation — slide down into the terrarium
        scene.tweens.add({
            targets: this,
            y: SUBSTRATE_TOP - 10,
            duration: 1500,
            ease: 'Sine.easeOut',
        });
    }

    setSpeedMultiplier(multiplier: number): void {
        this.speed *= multiplier;
    }

    update(_time: number, delta: number): void {
        if (!this.active || this.retreating || this.grabbing) return;

        this.healthBar.setPosition(this.x, this.y - 45);

        if (!this.target || !this.target.active || !this.target.isAlive) {
            this.target = null;
            return;
        }

        // Move toward target
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        if (dist < 20) {
            this.grabAnimal();
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.x += Math.cos(angle) * this.speed * (delta / 1000);
        this.y += Math.sin(angle) * this.speed * (delta / 1000);
    }

    setTarget(animal: Animal): void {
        this.target = animal;
    }

    takeDamage(): void {
        if (this.retreating || this.grabbing) return;

        this.clicksRemaining--;
        this.healthBar.updateBar(this.clicksRemaining / this.maxClicks);

        // Flinch animation
        this.scene.tweens.add({
            targets: this,
            x: this.x + Phaser.Math.Between(-15, 15),
            y: this.y - 10,
            duration: 100,
            yoyo: true,
        });

        if (this.clicksRemaining <= 0) {
            this.retreat();
        }
    }

    private retreat(): void {
        this.retreating = true;
        this.removeInteractive();

        // Comical retreat: spin and fly off screen
        this.scene.tweens.add({
            targets: this,
            y: -100,
            x: this.x + Phaser.Math.Between(-200, 200),
            angle: 720,
            alpha: 0,
            duration: 800,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.emit('repelled');
                this.destroy();
            },
        });
    }

    private grabAnimal(): void {
        if (!this.target || this.grabbing) return;
        this.grabbing = true;
        this.removeInteractive();

        const grabbed = this.target;
        grabbed.isAlive = false;
        const grabbedBody = grabbed.body as Phaser.Physics.Arcade.Body;
        grabbedBody.setVelocity(0, 0);
        grabbedBody.enable = false;

        // Grab animation: pull animal up and off screen
        this.scene.tweens.add({
            targets: [this, grabbed],
            y: -100,
            alpha: 0,
            duration: 1000,
            ease: 'Quad.easeIn',
            onComplete: () => {
                grabbed.emit('died', grabbed);
                grabbed.destroy();
                this.emit('grabbed', grabbed);
                this.destroy();
            },
        });
    }

    destroy(fromScene?: boolean): void {
        if (this.healthBar?.active) {
            this.healthBar.destroy();
        }
        super.destroy(fromScene);
    }
}
