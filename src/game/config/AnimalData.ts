export interface AnimalConfig {
    key: string;
    name: string;
    cost: number;
    coinDropInterval: number; // ms
    coinValue: number;
    hungerRate: number; // hunger units per second (out of 100 max)
    maxHunger: number;
    unlockLevel: number;
    spriteKey: string;
    spriteScale: number;
    babySpriteKey: string;
    babySpriteScale: number;
    feedsToGrow: number; // feedings needed to become adult
}

export const ANIMAL_DATA: Record<string, AnimalConfig> = {
    gecko: {
        key: 'gecko',
        name: 'Small Gecko',
        cost: 100,
        coinDropInterval: 8000,
        coinValue: 15,
        hungerRate: 3,
        maxHunger: 100,
        unlockLevel: 1,
        spriteKey: 'animal_gecko',
        spriteScale: 0.1,
        babySpriteKey: 'baby_gecko',
        babySpriteScale: 0.06,
        feedsToGrow: 3,
    },
    frog: {
        key: 'frog',
        name: 'Tree Frog',
        cost: 200,
        coinDropInterval: 10000,
        coinValue: 30,
        hungerRate: 3.5,
        maxHunger: 100,
        unlockLevel: 1,
        spriteKey: 'animal_frog',
        spriteScale: 0.1,
        babySpriteKey: 'baby_frog',
        babySpriteScale: 0.06,
        feedsToGrow: 3,
    },
    chameleon: {
        key: 'chameleon',
        name: 'Chameleon',
        cost: 500,
        coinDropInterval: 15000,
        coinValue: 80,
        hungerRate: 4,
        maxHunger: 100,
        unlockLevel: 2,
        spriteKey: 'animal_chameleon',
        spriteScale: 0.12,
        babySpriteKey: 'baby_chameleon',
        babySpriteScale: 0.07,
        feedsToGrow: 4,
    },
    salamander: {
        key: 'salamander',
        name: 'Salamander',
        cost: 750,
        coinDropInterval: 12000,
        coinValue: 100,
        hungerRate: 4.5,
        maxHunger: 100,
        unlockLevel: 3,
        spriteKey: 'animal_salamander',
        spriteScale: 0.12,
        babySpriteKey: 'baby_salamander',
        babySpriteScale: 0.07,
        feedsToGrow: 4,
    },
    dragon: {
        key: 'dragon',
        name: 'Bearded Dragon',
        cost: 1500,
        coinDropInterval: 18000,
        coinValue: 250,
        hungerRate: 5,
        maxHunger: 100,
        unlockLevel: 4,
        spriteKey: 'animal_dragon',
        spriteScale: 0.15,
        babySpriteKey: 'baby_dragon',
        babySpriteScale: 0.09,
        feedsToGrow: 5,
    },
};
