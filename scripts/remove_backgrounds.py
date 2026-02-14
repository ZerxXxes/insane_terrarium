#!/usr/bin/env python3
"""Remove black backgrounds from all sprite PNGs using edge flood-fill."""
import os
from collections import deque
from PIL import Image

THRESHOLD = 40  # pixels with R,G,B all below this are considered "black"

SPRITE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "sprites")
BG_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "backgrounds")


def is_near_black(r: int, g: int, b: int) -> bool:
    return r < THRESHOLD and g < THRESHOLD and b < THRESHOLD


def flood_fill_transparency(img: Image.Image) -> Image.Image:
    """Flood-fill from all edges to make connected near-black pixels transparent."""
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    visited = set()
    queue = deque()

    # Seed from all edge pixels that are near-black
    for x in range(w):
        for y in [0, h - 1]:
            r, g, b, a = pixels[x, y]
            if is_near_black(r, g, b):
                queue.append((x, y))
                visited.add((x, y))
    for y in range(h):
        for x in [0, w - 1]:
            r, g, b, a = pixels[x, y]
            if is_near_black(r, g, b) and (x, y) not in visited:
                queue.append((x, y))
                visited.add((x, y))

    # BFS flood fill
    while queue:
        cx, cy = queue.popleft()
        pixels[cx, cy] = (0, 0, 0, 0)  # make transparent

        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                if is_near_black(r, g, b):
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    return img


def process_file(filepath: str) -> None:
    img = Image.open(filepath)
    result = flood_fill_transparency(img)
    result.save(filepath)


if __name__ == "__main__":
    files = []
    for dirpath in [SPRITE_DIR, BG_DIR]:
        if not os.path.isdir(dirpath):
            continue
        for fname in sorted(os.listdir(dirpath)):
            if fname.endswith(".png"):
                files.append(os.path.join(dirpath, fname))

    # Skip the background image - it should keep its black areas
    files = [f for f in files if "terrarium_bg" not in os.path.basename(f)]

    print(f"Processing {len(files)} sprites...")
    for i, filepath in enumerate(files, 1):
        name = os.path.basename(filepath)
        print(f"  [{i}/{len(files)}] {name}")
        process_file(filepath)

    print("\nDone! All black backgrounds removed.")
