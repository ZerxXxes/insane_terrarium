import Phaser from 'phaser';

export class EconomyManager extends Phaser.Events.EventEmitter {
    private _coins: number;
    private _eggPiecesBought: boolean[];

    constructor(startCoins: number, eggCount: number = 3) {
        super();
        this._coins = startCoins;
        this._eggPiecesBought = new Array(eggCount).fill(false);
    }

    get coins(): number {
        return this._coins;
    }

    get eggPiecesBought(): boolean[] {
        return this._eggPiecesBought;
    }

    get eggPiecesCompleted(): number {
        return this._eggPiecesBought.filter(Boolean).length;
    }

    get allEggsBought(): boolean {
        return this._eggPiecesBought.every(Boolean);
    }

    canAfford(amount: number): boolean {
        return this._coins >= amount;
    }

    addCoins(amount: number): void {
        this._coins += amount;
        this.emit('coinsChanged', this._coins);
    }

    spendCoins(amount: number): boolean {
        if (!this.canAfford(amount)) return false;
        this._coins -= amount;
        this.emit('coinsChanged', this._coins);
        return true;
    }

    buyEggPiece(index: number): boolean {
        if (index < 0 || index >= this._eggPiecesBought.length) return false;
        if (this._eggPiecesBought[index]) return false;
        this._eggPiecesBought[index] = true;
        this.emit('eggPieceBought', index);
        return true;
    }
}
