#!/usr/bin/env python3
"""Batch generate all game assets for Insane Terrarium."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".claude", "skills", "image-generation", "scripts"))
from generate import generate_image

STYLE = "pixel art, 2D game sprite, retro game aesthetic, clean lines, centered in frame"
BG = "solid black background"

assets = [
    # Animals
    {
        "prompt": {"subject": "small bright green gecko lizard", "style": STYLE, "pose": "side view, facing right, standing", "appearance": "bright green body, large friendly eyes, small cute proportions", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/animal_gecko.png", "w": 512, "h": 512, "seed": 200,
    },
    {
        "prompt": {"subject": "red-eyed tree frog", "style": STYLE, "pose": "side view, facing right, sitting", "appearance": "bright green body, red eyes, orange feet, colorful tropical frog, cute", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/animal_frog.png", "w": 512, "h": 512, "seed": 201,
    },
    {
        "prompt": {"subject": "chameleon lizard", "style": STYLE, "pose": "side view, facing right, standing on branch", "appearance": "green and teal body, coiled tail, bulging eyes, color-shifting skin", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/animal_chameleon.png", "w": 512, "h": 512, "seed": 202,
    },
    {
        "prompt": {"subject": "fire salamander", "style": STYLE, "pose": "side view, facing right, walking", "appearance": "black body with bright yellow spots, sleek amphibian, moist skin", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/animal_salamander.png", "w": 512, "h": 512, "seed": 203,
    },
    {
        "prompt": {"subject": "bearded dragon lizard", "style": STYLE, "pose": "side view, facing right, standing proud", "appearance": "large tan and orange body, spiky beard, stocky build, desert lizard", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/animal_dragon.png", "w": 512, "h": 512, "seed": 204,
    },
    # Animal walk frames
    {
        "prompt": {"subject": "small bright green gecko lizard walking", "style": STYLE, "pose": "side view, facing right, walking, one leg forward", "appearance": "bright green body, large friendly eyes, walking pose variation", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/animal_gecko_walk.png", "w": 512, "h": 512, "seed": 210,
    },
    {
        "prompt": {"subject": "red-eyed tree frog hopping", "style": STYLE, "pose": "side view, facing right, mid-hop", "appearance": "bright green body, red eyes, orange feet, hopping pose", "background": BG, "details": "game-ready sprite, hopping pose"},
        "path": "public/assets/sprites/animal_frog_walk.png", "w": 512, "h": 512, "seed": 211,
    },
    {
        "prompt": {"subject": "chameleon lizard walking", "style": STYLE, "pose": "side view, facing right, walking on branch", "appearance": "green and teal body, coiled tail, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/animal_chameleon_walk.png", "w": 512, "h": 512, "seed": 212,
    },
    {
        "prompt": {"subject": "fire salamander walking", "style": STYLE, "pose": "side view, facing right, walking, legs forward", "appearance": "black body with bright yellow spots, walking pose variation", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/animal_salamander_walk.png", "w": 512, "h": 512, "seed": 213,
    },
    {
        "prompt": {"subject": "bearded dragon lizard walking", "style": STYLE, "pose": "side view, facing right, walking, one leg forward", "appearance": "large tan and orange body, spiky beard, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/animal_dragon_walk.png", "w": 512, "h": 512, "seed": 214,
    },
    # Baby animals (idle)
    {
        "prompt": {"subject": "baby gecko lizard", "style": STYLE, "pose": "side view, facing right, standing", "appearance": "tiny baby bright green gecko, oversized head, large cute eyes, baby proportions", "background": BG, "details": "game-ready sprite, baby animal"},
        "path": "public/assets/sprites/baby_gecko.png", "w": 512, "h": 512, "seed": 220,
        "input_images": ["public/assets/sprites/animal_gecko.png"],
    },
    {
        "prompt": {"subject": "baby tree frog", "style": STYLE, "pose": "side view, facing right, sitting", "appearance": "tiny baby red-eyed tree frog, oversized head, huge cute red eyes, baby proportions", "background": BG, "details": "game-ready sprite, baby animal"},
        "path": "public/assets/sprites/baby_frog.png", "w": 512, "h": 512, "seed": 222,
        "input_images": ["public/assets/sprites/animal_frog.png"],
    },
    {
        "prompt": {"subject": "baby chameleon lizard", "style": STYLE, "pose": "side view, facing right, standing", "appearance": "tiny baby chameleon, oversized head, huge bulging cute eyes, baby proportions", "background": BG, "details": "game-ready sprite, baby animal"},
        "path": "public/assets/sprites/baby_chameleon.png", "w": 512, "h": 512, "seed": 224,
        "input_images": ["public/assets/sprites/animal_chameleon.png"],
    },
    {
        "prompt": {"subject": "baby fire salamander", "style": STYLE, "pose": "side view, facing right, standing", "appearance": "tiny baby fire salamander, oversized head, large cute eyes, black with yellow spots, baby proportions", "background": BG, "details": "game-ready sprite, baby animal"},
        "path": "public/assets/sprites/baby_salamander.png", "w": 512, "h": 512, "seed": 226,
        "input_images": ["public/assets/sprites/animal_salamander.png"],
    },
    {
        "prompt": {"subject": "baby bearded dragon lizard", "style": STYLE, "pose": "side view, facing right, standing", "appearance": "tiny baby bearded dragon, oversized head, large cute eyes, tan and orange, baby proportions", "background": BG, "details": "game-ready sprite, baby animal"},
        "path": "public/assets/sprites/baby_dragon.png", "w": 512, "h": 512, "seed": 228,
        "input_images": ["public/assets/sprites/animal_dragon.png"],
    },
    # Baby animals (walk)
    {
        "prompt": {"subject": "baby gecko lizard walking", "style": STYLE, "pose": "side view, facing right, walking", "appearance": "tiny baby bright green gecko, oversized head, large cute eyes, walking pose", "background": BG, "details": "game-ready sprite, baby animal walking"},
        "path": "public/assets/sprites/baby_gecko_walk.png", "w": 512, "h": 512, "seed": 221,
        "input_images": ["public/assets/sprites/animal_gecko_walk.png"],
    },
    {
        "prompt": {"subject": "baby tree frog hopping", "style": STYLE, "pose": "side view, facing right, hopping", "appearance": "tiny baby red-eyed tree frog, oversized head, huge cute red eyes, hopping pose", "background": BG, "details": "game-ready sprite, baby animal hopping"},
        "path": "public/assets/sprites/baby_frog_walk.png", "w": 512, "h": 512, "seed": 223,
        "input_images": ["public/assets/sprites/animal_frog_walk.png"],
    },
    {
        "prompt": {"subject": "baby chameleon lizard walking", "style": STYLE, "pose": "side view, facing right, walking", "appearance": "tiny baby chameleon, oversized head, huge bulging cute eyes, walking pose", "background": BG, "details": "game-ready sprite, baby animal walking"},
        "path": "public/assets/sprites/baby_chameleon_walk.png", "w": 512, "h": 512, "seed": 225,
        "input_images": ["public/assets/sprites/animal_chameleon_walk.png"],
    },
    {
        "prompt": {"subject": "baby fire salamander walking", "style": STYLE, "pose": "side view, facing right, walking", "appearance": "tiny baby fire salamander, oversized head, large cute eyes, walking pose", "background": BG, "details": "game-ready sprite, baby animal walking"},
        "path": "public/assets/sprites/baby_salamander_walk.png", "w": 512, "h": 512, "seed": 227,
        "input_images": ["public/assets/sprites/animal_salamander_walk.png"],
    },
    {
        "prompt": {"subject": "baby bearded dragon lizard walking", "style": STYLE, "pose": "side view, facing right, walking", "appearance": "tiny baby bearded dragon, oversized head, large cute eyes, walking pose", "background": BG, "details": "game-ready sprite, baby animal walking"},
        "path": "public/assets/sprites/baby_dragon_walk.png", "w": 512, "h": 512, "seed": 229,
        "input_images": ["public/assets/sprites/animal_dragon_walk.png"],
    },
    # Food
    {
        "prompt": {"subject": "brown cricket insect", "style": STYLE, "pose": "side view, facing right", "appearance": "small brown cricket, long antennae, jumping legs", "background": BG, "details": "tiny game sprite, game-ready"},
        "path": "public/assets/sprites/food_cricket.png", "w": 512, "h": 512, "seed": 300,
    },
    {
        "prompt": {"subject": "mealworm larva", "style": STYLE, "pose": "side view, slightly curved", "appearance": "tan yellow segmented worm, small, plump", "background": BG, "details": "tiny game sprite, game-ready"},
        "path": "public/assets/sprites/food_mealworm.png", "w": 512, "h": 512, "seed": 301,
    },
    {
        "prompt": {"subject": "dubia roach insect", "style": STYLE, "pose": "top-down view", "appearance": "dark brown rounded roach, shiny shell, small legs", "background": BG, "details": "tiny game sprite, game-ready"},
        "path": "public/assets/sprites/food_roach.png", "w": 512, "h": 512, "seed": 302,
    },
    # Coin
    {
        "prompt": {"subject": "gold coin", "style": STYLE, "appearance": "shiny gold coin with a small leaf emblem embossed on it, metallic sheen", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin.png", "w": 512, "h": 512, "seed": 400,
    },
    # Coin flip frame
    {
        "prompt": {"subject": "gold coin edge view", "style": STYLE, "appearance": "shiny gold coin seen from edge/side, metallic gold sheen, thin", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin_flip.png", "w": 512, "h": 512, "seed": 401,
    },
    # Bronze coins
    {
        "prompt": {"subject": "bronze coin", "style": STYLE, "appearance": "copper-toned bronze coin with a small leaf emblem embossed on it, metallic copper sheen, dull brownish metal", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin_bronze.png", "w": 512, "h": 512, "seed": 410,
        "input_images": ["public/assets/sprites/coin.png"],
    },
    {
        "prompt": {"subject": "bronze coin edge view", "style": STYLE, "appearance": "copper-toned bronze coin seen from edge/side, metallic copper sheen, dull brownish metal", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin_bronze_flip.png", "w": 512, "h": 512, "seed": 411,
        "input_images": ["public/assets/sprites/coin_flip.png"],
    },
    # Silver coins
    {
        "prompt": {"subject": "silver coin", "style": STYLE, "appearance": "shiny silver coin with a small leaf emblem embossed on it, metallic silver sheen, bright white-grey metal", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin_silver.png", "w": 512, "h": 512, "seed": 412,
        "input_images": ["public/assets/sprites/coin.png"],
    },
    {
        "prompt": {"subject": "silver coin edge view", "style": STYLE, "appearance": "shiny silver coin seen from edge/side, metallic silver sheen, bright white-grey metal", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin_silver_flip.png", "w": 512, "h": 512, "seed": 413,
        "input_images": ["public/assets/sprites/coin_flip.png"],
    },
    # Egg pieces
    {
        "prompt": {"subject": "reptile egg", "style": STYLE, "appearance": "cream colored intact reptile egg, smooth oval, slight speckles", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/egg_piece.png", "w": 512, "h": 512, "seed": 401,
    },
    {
        "prompt": {"subject": "empty egg slot", "style": STYLE, "appearance": "dark grey oval outline, empty slot placeholder, dashed border", "background": BG, "details": "game-ready icon, UI element, centered"},
        "path": "public/assets/sprites/egg_piece_empty.png", "w": 512, "h": 512, "seed": 402,
    },
    # Poacher hand
    {
        "prompt": {"subject": "cartoonish white gloved hand reaching down", "style": STYLE, "pose": "reaching downward from above, grabbing motion", "appearance": "white cartoon glove, comical villain hand, exaggerated fingers", "background": BG, "details": "game-ready sprite, menacing but funny"},
        "path": "public/assets/sprites/poacher_hand.png", "w": 512, "h": 768, "seed": 500,
    },
    # Thought bubble
    {
        "prompt": {"subject": "white thought bubble with small cricket inside", "style": STYLE, "appearance": "classic comic thought bubble, white puffy cloud shape, tiny brown cricket icon inside", "background": BG, "details": "game-ready UI element, centered"},
        "path": "public/assets/sprites/thought_bubble.png", "w": 512, "h": 512, "seed": 501,
    },
    # Helper pets
    {
        "prompt": {"subject": "cute tortoise", "style": STYLE, "pose": "side view, facing right", "appearance": "small green-brown tortoise, friendly, dome shell, stubby legs", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_tortoise.png", "w": 512, "h": 512, "seed": 600,
    },
    {
        "prompt": {"subject": "hermit crab", "style": STYLE, "pose": "side view, facing right", "appearance": "cute hermit crab in colorful spiral shell, orange claws, beady eyes", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_hermit_crab.png", "w": 512, "h": 512, "seed": 601,
    },
    {
        "prompt": {"subject": "praying mantis insect", "style": STYLE, "pose": "side view, facing right, combat stance", "appearance": "bright green praying mantis, large forelegs, triangular head, fierce look", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_mantis.png", "w": 512, "h": 512, "seed": 602,
    },
    {
        "prompt": {"subject": "garden snail", "style": STYLE, "pose": "side view, facing right, crawling", "appearance": "cute snail with golden-brown spiral shell, pale body, eye stalks", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_snail.png", "w": 512, "h": 512, "seed": 603,
    },
    {
        "prompt": {"subject": "stag beetle", "style": STYLE, "pose": "side view, facing right", "appearance": "dark green-black stag beetle, large mandibles, shiny carapace, sturdy", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_beetle.png", "w": 512, "h": 512, "seed": 604,
    },
    {
        "prompt": {"subject": "scorpion", "style": STYLE, "pose": "side view, facing right, tail raised", "appearance": "dark red-brown scorpion, curved stinger tail, large pincers, intimidating", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_scorpion.png", "w": 512, "h": 512, "seed": 605,
    },
    {
        "prompt": {"subject": "small green tree snake", "style": STYLE, "pose": "side view, coiled on branch", "appearance": "bright green tree snake, slender body, friendly eyes, coiled pose", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_snake.png", "w": 512, "h": 512, "seed": 606,
    },
    {
        "prompt": {"subject": "millipede", "style": STYLE, "pose": "side view, facing right, crawling", "appearance": "brown segmented millipede, many tiny legs, cute rounded segments", "background": BG, "details": "game-ready sprite"},
        "path": "public/assets/sprites/helper_millipede.png", "w": 512, "h": 512, "seed": 607,
    },
    # Helper pet walk frames
    {
        "prompt": {"subject": "cute tortoise walking", "style": STYLE, "pose": "side view, facing right, one leg forward in walking motion", "appearance": "small green-brown tortoise, friendly, dome shell, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/helper_tortoise_walk.png", "w": 512, "h": 512, "seed": 610,
        "input_images": ["public/assets/sprites/helper_tortoise.png"],
    },
    {
        "prompt": {"subject": "hermit crab walking", "style": STYLE, "pose": "side view, facing right, legs moving", "appearance": "cute hermit crab in colorful spiral shell, orange claws, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/helper_hermit_crab_walk.png", "w": 512, "h": 512, "seed": 611,
        "input_images": ["public/assets/sprites/helper_hermit_crab.png"],
    },
    {
        "prompt": {"subject": "praying mantis walking", "style": STYLE, "pose": "side view, facing right, legs in walking motion", "appearance": "bright green praying mantis, large forelegs, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/helper_mantis_walk.png", "w": 512, "h": 512, "seed": 612,
        "input_images": ["public/assets/sprites/helper_mantis.png"],
    },
    {
        "prompt": {"subject": "garden snail crawling", "style": STYLE, "pose": "side view, facing right, body stretched forward", "appearance": "cute snail with golden-brown spiral shell, crawling pose", "background": BG, "details": "game-ready sprite, crawling pose"},
        "path": "public/assets/sprites/helper_snail_walk.png", "w": 512, "h": 512, "seed": 613,
        "input_images": ["public/assets/sprites/helper_snail.png"],
    },
    {
        "prompt": {"subject": "stag beetle walking", "style": STYLE, "pose": "side view, facing right, legs in walking motion", "appearance": "dark green-black stag beetle, large mandibles, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/helper_beetle_walk.png", "w": 512, "h": 512, "seed": 614,
        "input_images": ["public/assets/sprites/helper_beetle.png"],
    },
    {
        "prompt": {"subject": "scorpion walking", "style": STYLE, "pose": "side view, facing right, legs moving, tail raised", "appearance": "dark red-brown scorpion, curved stinger tail, walking pose", "background": BG, "details": "game-ready sprite, walking pose"},
        "path": "public/assets/sprites/helper_scorpion_walk.png", "w": 512, "h": 512, "seed": 615,
        "input_images": ["public/assets/sprites/helper_scorpion.png"],
    },
    {
        "prompt": {"subject": "small green tree snake slithering", "style": STYLE, "pose": "side view, slithering motion", "appearance": "bright green tree snake, slender body, slithering pose", "background": BG, "details": "game-ready sprite, slithering pose"},
        "path": "public/assets/sprites/helper_snake_walk.png", "w": 512, "h": 512, "seed": 616,
        "input_images": ["public/assets/sprites/helper_snake.png"],
    },
    {
        "prompt": {"subject": "millipede crawling", "style": STYLE, "pose": "side view, facing right, legs rippling", "appearance": "brown segmented millipede, many tiny legs in wave motion, crawling pose", "background": BG, "details": "game-ready sprite, crawling pose"},
        "path": "public/assets/sprites/helper_millipede_walk.png", "w": 512, "h": 512, "seed": 617,
        "input_images": ["public/assets/sprites/helper_millipede.png"],
    },
    # UI
    {
        "prompt": {"asset_type": "ui_component", "element": "shop button frame", "style": "pixel art, 2D game UI, retro aesthetic", "shape": "square button, wooden frame with stone inset", "background": "dark interior", "details": "rustic terrarium themed, ornate but simple"},
        "path": "public/assets/ui/shop_button.png", "w": 512, "h": 512, "seed": 700,
    },
    # Backgrounds (2048x1536 hi-res)
    {
        "prompt": {"subject": "glass terrarium interior view, wide landscape", "style": "pixel art, 2D game background, retro aesthetic, warm lighting", "scene": "brown substrate floor with scattered small rocks, lush green tropical plants along the sides, small water dish, piece of driftwood", "background": "glass terrarium walls visible, warm golden lighting from above", "details": "cozy tropical terrarium environment, suitable as game background, no animals, detailed ground texture"},
        "path": "public/assets/backgrounds/terrarium_tropical.png", "w": 2048, "h": 1536, "seed": 1001,
    },
    {
        "prompt": {"subject": "glass terrarium interior view, wide landscape, desert theme", "style": "pixel art, 2D game background, retro aesthetic, warm orange lighting", "scene": "sandy substrate floor, small cacti and succulents, red and orange rocks, dry twisted driftwood, sand dunes", "background": "glass terrarium walls visible, warm orange desert lighting from above", "details": "arid desert terrarium environment, suitable as game background, no animals, detailed sand texture"},
        "path": "public/assets/backgrounds/terrarium_desert.png", "w": 2048, "h": 1536, "seed": 1002,
    },
    {
        "prompt": {"subject": "glass terrarium interior view, wide landscape, rainforest theme", "style": "pixel art, 2D game background, retro aesthetic, misty blue-green lighting", "scene": "dark rich soil substrate, dense ferns and hanging moss, small waterfall stream, wet rocks, mushrooms on log", "background": "glass terrarium walls visible, cool blue-green misty lighting from above", "details": "lush humid rainforest terrarium environment, suitable as game background, no animals, detailed mossy ground texture"},
        "path": "public/assets/backgrounds/terrarium_rainforest.png", "w": 2048, "h": 1536, "seed": 1003,
    },
]

if __name__ == "__main__":
    total = len(assets)
    for i, asset in enumerate(assets):
        name = os.path.basename(asset["path"])
        print(f"[{i+1}/{total}] Generating {name}...")
        try:
            result = generate_image(
                prompt=asset["prompt"],
                save_path=asset["path"],
                width=asset["w"],
                height=asset["h"],
                seed=asset.get("seed"),
                input_images=asset.get("input_images"),
            )
            print(f"  -> Done: {result['save_path']}")
        except Exception as e:
            print(f"  -> FAILED: {e}", file=sys.stderr)
    print(f"\nAll done! Generated {total} assets.")
