export interface FoodConfig {
    key: string;
    name: string;
    cost: number;
    nutrition: number; // hunger units restored
    unlockLevel: number;
    speed: number; // crawl speed in px/s
    spriteKey: string;
}

export const FOOD_DATA: Record<string, FoodConfig> = {
    cricket: {
        key: 'cricket',
        name: 'Cricket',
        cost: 0,
        nutrition: 25,
        unlockLevel: 1,
        speed: 40,
        spriteKey: 'food_cricket',
    },
    mealworm: {
        key: 'mealworm',
        name: 'Mealworm',
        cost: 5,
        nutrition: 50,
        unlockLevel: 2,
        speed: 25,
        spriteKey: 'food_mealworm',
    },
    roach: {
        key: 'roach',
        name: 'Dubia Roach',
        cost: 15,
        nutrition: 100,
        unlockLevel: 4,
        speed: 30,
        spriteKey: 'food_roach',
    },
};
