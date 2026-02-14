#!/usr/bin/env python3
"""Generate walk-cycle frames for animals using i2i from base sprites."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".claude", "skills", "image-generation", "scripts"))
from generate import generate_image

STYLE = "pixel art, 2D game sprite, retro game aesthetic, clean lines, centered in frame"
BG = "solid black background"

animals = [
    {
        "name": "gecko",
        "ref": "public/assets/sprites/animal_gecko.png",
        "desc": "bright green gecko lizard",
    },
    {
        "name": "frog",
        "ref": "public/assets/sprites/animal_frog.png",
        "desc": "red-eyed tree frog",
    },
    {
        "name": "chameleon",
        "ref": "public/assets/sprites/animal_chameleon.png",
        "desc": "green and teal chameleon",
    },
    {
        "name": "salamander",
        "ref": "public/assets/sprites/animal_salamander.png",
        "desc": "black fire salamander with yellow spots",
    },
    {
        "name": "dragon",
        "ref": "public/assets/sprites/animal_dragon.png",
        "desc": "tan bearded dragon lizard",
    },
]

# Also generate coin rotation frame
extras = [
    {
        "name": "coin_flip",
        "ref": "public/assets/sprites/coin.png",
        "prompt": {"subject": "gold coin seen from edge, thin oval shape", "style": STYLE, "appearance": "shiny gold coin viewed at angle, narrow ellipse, metallic sheen", "background": BG, "details": "game-ready icon, centered"},
        "path": "public/assets/sprites/coin_flip.png",
        "seed": 410,
    },
]

if __name__ == "__main__":
    total = len(animals) + len(extras)
    idx = 0

    for animal in animals:
        idx += 1
        out = f"public/assets/sprites/animal_{animal['name']}_walk.png"
        print(f"[{idx}/{total}] Generating {os.path.basename(out)}...")
        try:
            result = generate_image(
                prompt={
                    "subject": f"{animal['desc']}, same character as reference",
                    "style": STYLE,
                    "pose": "side view, facing right, mid-stride walking pose, legs extended",
                    "background": BG,
                    "details": "game-ready sprite, same art style as reference image",
                },
                save_path=out,
                width=512,
                height=512,
                seed=800 + idx,
                input_images=[animal["ref"]],
            )
            print(f"  -> Done: {result['save_path']}")
        except Exception as e:
            print(f"  -> FAILED: {e}", file=sys.stderr)

    for extra in extras:
        idx += 1
        print(f"[{idx}/{total}] Generating {os.path.basename(extra['path'])}...")
        try:
            result = generate_image(
                prompt=extra["prompt"],
                save_path=extra["path"],
                width=512,
                height=512,
                seed=extra["seed"],
                input_images=[extra["ref"]],
            )
            print(f"  -> Done: {result['save_path']}")
        except Exception as e:
            print(f"  -> FAILED: {e}", file=sys.stderr)

    print(f"\nDone! Generated {total} animation frames.")
