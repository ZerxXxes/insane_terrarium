export interface HelperPetConfig {
    key: string;
    name: string;
    role: string;
    description: string;
    spriteKey: string;
    effectParams: Record<string, number>;
}

export const HELPER_PET_DATA: Record<string, HelperPetConfig> = {
    tortoise: {
        key: 'tortoise',
        name: 'Tortoise',
        role: 'Auto-feeder',
        description: 'Drops crickets automatically every 20s',
        spriteKey: 'helper_tortoise',
        effectParams: { interval: 20000 },
    },
    hermit_crab: {
        key: 'hermit_crab',
        name: 'Hermit Crab',
        role: 'Coin collector',
        description: 'Automatically picks up nearby coins',
        spriteKey: 'helper_hermit_crab',
        effectParams: { collectRadius: 120 },
    },
    mantis: {
        key: 'mantis',
        name: 'Praying Mantis',
        role: 'Guard',
        description: 'Attacks the poacher hand (1 click/sec)',
        spriteKey: 'helper_mantis',
        effectParams: { damageInterval: 1000 },
    },
    snail: {
        key: 'snail',
        name: 'Snail',
        role: 'Coin booster',
        description: 'Nearby animals drop +50% coin value',
        spriteKey: 'helper_snail',
        effectParams: { boostRadius: 150, boostMultiplier: 1.5 },
    },
    beetle: {
        key: 'beetle',
        name: 'Beetle',
        role: 'Food upgrader',
        description: 'Crickets fill 2x hunger',
        spriteKey: 'helper_beetle',
        effectParams: { nutritionMultiplier: 2 },
    },
    scorpion: {
        key: 'scorpion',
        name: 'Scorpion',
        role: 'Intimidator',
        description: 'Poacher hand moves 30% slower',
        spriteKey: 'helper_scorpion',
        effectParams: { slowFactor: 0.7 },
    },
    snake: {
        key: 'snake',
        name: 'Tree Snake',
        role: 'Breeder',
        description: '10% chance an animal duplicates when fed',
        spriteKey: 'helper_snake',
        effectParams: { breedChance: 0.1 },
    },
    millipede: {
        key: 'millipede',
        name: 'Millipede',
        role: 'Scavenger',
        description: 'Produces 1 coin every 10s on its own',
        spriteKey: 'helper_millipede',
        effectParams: { coinInterval: 10000, coinValue: 1 },
    },
};
