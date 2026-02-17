import Phaser from 'phaser';
import { HELPER_PET_DATA, HelperPetConfig } from '../config/HelperPetData';

const REGISTRY_KEY = 'ownedHelperPets';

export class HelperManager {
    private game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
        if (!this.game.registry.has(REGISTRY_KEY)) {
            this.game.registry.set(REGISTRY_KEY, [] as string[]);
        }
    }

    get ownedKeys(): string[] {
        return this.game.registry.get(REGISTRY_KEY) as string[];
    }

    addPet(key: string): void {
        const owned = this.ownedKeys;
        if (!owned.includes(key)) {
            owned.push(key);
            this.game.registry.set(REGISTRY_KEY, owned);
        }
    }

    hasPet(key: string): boolean {
        return this.ownedKeys.includes(key);
    }

    getOwnedConfigs(): HelperPetConfig[] {
        return this.ownedKeys
            .map(k => HELPER_PET_DATA[k])
            .filter(Boolean);
    }

    getRandomUnownedChoices(maxChoices: number = 2): HelperPetConfig[] {
        const allKeys = Object.keys(HELPER_PET_DATA);
        const unowned = allKeys.filter(k => !this.ownedKeys.includes(k));
        if (unowned.length === 0) return [];

        // Shuffle and pick up to maxChoices
        for (let i = unowned.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unowned[i], unowned[j]] = [unowned[j], unowned[i]];
        }

        const count = Math.max(1, Math.min(maxChoices, unowned.length));
        return unowned.slice(0, count)
            .map(key => HELPER_PET_DATA[key])
            .filter(Boolean);
    }

    reset(): void {
        this.game.registry.set(REGISTRY_KEY, []);
    }
}
