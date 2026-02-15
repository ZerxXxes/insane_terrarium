# Insane Terrarium

A 2D browser game inspired by the classic Insaniquarium — but with reptiles, amphibians, and a terrarium twist. Feed your animals, collect coins, fend off poachers, and hatch eggs to advance through 5 increasingly challenging levels.

<p align="center">
  <img src="public/assets/backgrounds/terrarium_tropical.png" alt="Tropical Terrarium" width="400">
  <img src="public/assets/backgrounds/terrarium_desert.png" alt="Desert Terrarium" width="400">
  <img src="public/assets/backgrounds/terrarium_rainforest.png" alt="Rainforest Terrarium" width="400">
</p>

## Gameplay

- **Feed** your animals by clicking anywhere in the terrarium to drop bugs
- **Raise babies** — new animals start as babies that only eat; feed them enough times and they grow into coin-producing adults
- **Collect coins** that well-fed adult animals drop — bronze, silver, or gold based on value
- **Buy** new animals and food upgrades from the shop
- **Defend** against poachers trying to steal your animals (Level 2+)
- **Complete levels** by purchasing all 3 egg pieces
- **Choose helper pets** between levels for unique passive bonuses

## Animals

Collect and raise 5 unique reptiles and amphibians. Each starts as a baby that must be fed before growing into a coin-producing adult:

<p align="center">
  <img src="public/assets/sprites/baby_gecko.png" alt="Baby Gecko" width="60">
  <img src="public/assets/sprites/animal_gecko.png" alt="Small Gecko" width="100">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/baby_frog.png" alt="Baby Frog" width="60">
  <img src="public/assets/sprites/animal_frog.png" alt="Tree Frog" width="100">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/baby_chameleon.png" alt="Baby Chameleon" width="60">
  <img src="public/assets/sprites/animal_chameleon.png" alt="Chameleon" width="100">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/baby_salamander.png" alt="Baby Salamander" width="60">
  <img src="public/assets/sprites/animal_salamander.png" alt="Salamander" width="100">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/baby_dragon.png" alt="Baby Dragon" width="60">
  <img src="public/assets/sprites/animal_dragon.png" alt="Bearded Dragon" width="100">
</p>

| Animal | Cost | Coin Drop | Coin Tier | Feeds to Grow | Unlock |
|--------|------|-----------|-----------|---------------|--------|
| Small Gecko | 100 | 15 every 8s | Bronze | 3 | Level 1 |
| Tree Frog | 200 | 30 every 10s | Bronze | 3 | Level 1 |
| Chameleon | 500 | 80 every 15s | Silver | 4 | Level 2 |
| Salamander | 750 | 100 every 12s | Silver | 4 | Level 3 |
| Bearded Dragon | 1500 | 250 every 18s | Gold | 5 | Level 4 |

## Helper Pets

Between levels, choose from 8 helper pets that provide passive bonuses throughout the rest of the game:

<p align="center">
  <img src="public/assets/sprites/helper_tortoise.png" alt="Tortoise" width="80">
  <img src="public/assets/sprites/helper_hermit_crab.png" alt="Hermit Crab" width="80">
  <img src="public/assets/sprites/helper_mantis.png" alt="Praying Mantis" width="80">
  <img src="public/assets/sprites/helper_snail.png" alt="Snail" width="80">
  <img src="public/assets/sprites/helper_beetle.png" alt="Beetle" width="80">
  <img src="public/assets/sprites/helper_scorpion.png" alt="Scorpion" width="80">
  <img src="public/assets/sprites/helper_snake.png" alt="Tree Snake" width="80">
  <img src="public/assets/sprites/helper_millipede.png" alt="Millipede" width="80">
</p>

| Pet | Role | Effect |
|-----|------|--------|
| Tortoise | Auto-Feeder | Drops a cricket every 20s |
| Hermit Crab | Coin Collector | Auto-collects nearby coins |
| Praying Mantis | Guard | Auto-clicks poacher 1/sec |
| Snail | Coin Booster | Nearby animals drop +50% value |
| Beetle | Food Upgrader | All food fills 2x hunger |
| Scorpion | Intimidator | Poacher moves 30% slower |
| Tree Snake | Breeder | 10% chance to duplicate animal on feed |
| Millipede | Scavenger | Produces 1 coin every 10s |

## Items

<p align="center">
  <img src="public/assets/sprites/coin_bronze.png" alt="Bronze Coin" width="64">
  <img src="public/assets/sprites/coin_silver.png" alt="Silver Coin" width="64">
  <img src="public/assets/sprites/coin.png" alt="Gold Coin" width="64">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/food_cricket.png" alt="Cricket" width="64">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/egg_piece.png" alt="Egg Piece" width="64">
  &nbsp;&nbsp;
  <img src="public/assets/sprites/poacher_hand.png" alt="Poacher" width="48">
</p>

- **Coins** — Dropped by happy adult animals. Bronze, silver, or gold based on value. Click to collect!
- **Food** — Crickets (free), Mealworms (5 coins), Dubia Roaches (15 coins)
- **Egg Pieces** — Buy all 3 to complete each level
- **Poacher** — Click rapidly to fend off! Appears from Level 2 onward

## Tech Stack

- **[Phaser 3](https://phaser.io/)** — Game framework (Arcade Physics, tweens, animations)
- **TypeScript** — Type-safe game logic
- **Vite** — Fast dev server and production bundler
- **[FLUX.2](https://blackforestlabs.ai/)** — All pixel art sprites AI-generated with FLUX.2 Klein 9B

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev

# Production build
npm run build
```

## Project Structure

```
src/game/
  config/       — Game balance data (animals, food, levels, helpers)
  entities/     — Animal, Food, Coin, Poacher, HelperPet, ThoughtBubble
  managers/     — Economy, Level, and Helper pet persistence
  scenes/       — Boot, Preload, Menu, Game, Shop, Win, GameOver
  systems/      — PoacherAI, HelperPetAI
  ui/           — HUD, ShopBar, ShopItem, HealthBar, Tutorial
public/assets/  — All game sprites, backgrounds, and UI elements
```

## License

MIT
