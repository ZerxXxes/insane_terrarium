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
}

export const ANIMAL_DATA: Record<string, AnimalConfig> = {
    gecko: {
        key: 'gecko',
        name: 'Small Gecko',
        cost: 100,
        coinDropInterval: 8000,
        coinValue: 1,
        hungerRate: 3,
        maxHunger: 100,
        unlockLevel: 1,
        spriteKey: 'animal_gecko',
        spriteScale: 1,
    },
    frog: {
        key: 'frog',
        name: 'Tree Frog',
        cost: 200,
        coinDropInterval: 10000,
        coinValue: 3,
        hungerRate: 3.5,
        maxHunger: 100,
        unlockLevel: 1,
        spriteKey: 'animal_frog',
        spriteScale: 1,
    },
    chameleon: {
        key: 'chameleon',
        name: 'Chameleon',
        cost: 500,
        coinDropInterval: 15000,
        coinValue: 10,
        hungerRate: 4,
        maxHunger: 100,
        unlockLevel: 2,
        spriteKey: 'animal_chameleon',
        spriteScale: 1,
    },
    salamander: {
        key: 'salamander',
        name: 'Salamander',
        cost: 750,
        coinDropInterval: 12000,
        coinValue: 15,
        hungerRate: 4.5,
        maxHunger: 100,
        unlockLevel: 3,
        spriteKey: 'animal_salamander',
        spriteScale: 1,
    },
    dragon: {
        key: 'dragon',
        name: 'Bearded Dragon',
        cost: 1500,
        coinDropInterval: 18000,
        coinValue: 40,
        hungerRate: 5,
        maxHunger: 100,
        unlockLevel: 4,
        spriteKey: 'animal_dragon',
        spriteScale: 1,
    },
};
