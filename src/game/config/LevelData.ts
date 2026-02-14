export interface PoacherConfig {
    clicksToRepel: number;
    frequency: number; // ms between spawns
    speed: number; // px/s
    maxOverlapping: number; // how many can be active at once
}

export interface LevelConfig {
    level: number;
    startCoins: number;
    eggCosts: [number, number, number];
    poacherConfig: PoacherConfig | null;
}

export const LEVEL_DATA: LevelConfig[] = [
    {
        level: 1,
        startCoins: 200,
        eggCosts: [300, 500, 800],
        poacherConfig: null,
    },
    {
        level: 2,
        startCoins: 200,
        eggCosts: [500, 800, 1200],
        poacherConfig: {
            clicksToRepel: 3,
            frequency: 90000,
            speed: 30,
            maxOverlapping: 1,
        },
    },
    {
        level: 3,
        startCoins: 300,
        eggCosts: [800, 1200, 2000],
        poacherConfig: {
            clicksToRepel: 5,
            frequency: 70000,
            speed: 45,
            maxOverlapping: 1,
        },
    },
    {
        level: 4,
        startCoins: 300,
        eggCosts: [1500, 2500, 4000],
        poacherConfig: {
            clicksToRepel: 8,
            frequency: 50000,
            speed: 60,
            maxOverlapping: 2,
        },
    },
    {
        level: 5,
        startCoins: 400,
        eggCosts: [3000, 5000, 8000],
        poacherConfig: {
            clicksToRepel: 12,
            frequency: 40000,
            speed: 75,
            maxOverlapping: 2,
        },
    },
];

export function getLevelConfig(level: number): LevelConfig {
    return LEVEL_DATA[level - 1] ?? LEVEL_DATA[0];
}
