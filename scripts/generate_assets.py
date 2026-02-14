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
    # UI
    {
        "prompt": {"asset_type": "ui_component", "element": "shop button frame", "style": "pixel art, 2D game UI, retro aesthetic", "shape": "square button, wooden frame with stone inset", "background": "dark interior", "details": "rustic terrarium themed, ornate but simple"},
        "path": "public/assets/ui/shop_button.png", "w": 512, "h": 512, "seed": 700,
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
            )
            print(f"  -> Done: {result['save_path']}")
        except Exception as e:
            print(f"  -> FAILED: {e}", file=sys.stderr)
    print(f"\nAll done! Generated {total} assets.")
