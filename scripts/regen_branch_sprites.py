#!/usr/bin/env python3
"""Regenerate chameleon and snake sprites without tree branches."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".claude", "skills", "image-generation", "scripts"))
from generate import generate_image

STYLE = "pixel art, 2D game sprite, retro game aesthetic, clean lines, centered in frame"
BG = "solid black background"

sprites = [
    {
        "prompt": {
            "subject": "chameleon lizard",
            "style": STYLE,
            "pose": "side view, facing right, standing on ground, all four feet on ground",
            "appearance": "green and teal body, coiled tail, bulging eyes, color-shifting skin",
            "background": BG,
            "details": "game-ready sprite, no branch, no tree, standing on flat surface",
        },
        "path": "public/assets/sprites/animal_chameleon.png",
        "ref": "public/assets/sprites/animal_chameleon_walk.png",
        "seed": 220,
    },
    {
        "prompt": {
            "subject": "small green tree snake",
            "style": STYLE,
            "pose": "side view, facing right, slithering on ground",
            "appearance": "bright green tree snake, slender body, friendly eyes, S-curve slithering pose",
            "background": BG,
            "details": "game-ready sprite, no branch, no tree, snake on flat ground",
        },
        "path": "public/assets/sprites/helper_snake.png",
        "ref": None,
        "seed": 620,
    },
]

if __name__ == "__main__":
    for i, sprite in enumerate(sprites, 1):
        name = os.path.basename(sprite["path"])
        print(f"[{i}/{len(sprites)}] Regenerating {name}...")
        try:
            kwargs = {
                "prompt": sprite["prompt"],
                "save_path": sprite["path"],
                "width": 512,
                "height": 512,
                "seed": sprite["seed"],
            }
            if sprite["ref"]:
                kwargs["input_images"] = [sprite["ref"]]
            result = generate_image(**kwargs)
            print(f"  -> Done: {result['save_path']}")
        except Exception as e:
            print(f"  -> FAILED: {e}", file=sys.stderr)

    print("\nDone! Now run scripts/remove_backgrounds.py to fix transparency.")
