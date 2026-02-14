# Prompt Engineering for FLUX.2 Game Assets

The API accepts plain text strings or structured JSON dicts. **Dict prompts are recommended for game assets** — they get JSON-serialized before the text encoder processes them, and the model reads the key-value structure, producing more controllable results.

## Dict Templates

### Character Sprites

```json
{
    "subject": "warrior character",
    "style": "2D side-view sprite, clean lines",
    "pose": "idle standing, facing right",
    "appearance": "plate armor, sword and shield, red cape",
    "background": "solid dark background",
    "details": "game-ready, consistent proportions"
}
```

### UI Elements

```json
{
    "asset_type": "ui_component",
    "element": "health bar frame",
    "style": "medieval fantasy UI, ornate gold border",
    "shape": "horizontal rectangle, wide aspect ratio",
    "background": "dark, semi-transparent",
    "details": "decorative corners, gem accents"
}
```

### Items and Icons

```json
{
    "subject": "iron sword",
    "asset_type": "inventory icon",
    "style": "hand-painted, slightly stylized",
    "view": "centered, 3/4 angle",
    "background": "solid dark background",
    "details": "metallic sheen, leather-wrapped grip"
}
```

### Enemies / NPCs

```json
{
    "subject": "goblin enemy",
    "style": "2D sprite, cartoony proportions",
    "pose": "aggressive stance, facing left",
    "appearance": "green skin, crude leather armor, wooden club",
    "background": "solid color background",
    "details": "menacing expression, small stature"
}
```

### Tilesets / Environment Pieces

```json
{
    "subject": "stone dungeon wall",
    "asset_type": "tileset piece",
    "style": "top-down perspective, seamless tile",
    "details": "mossy cracks, torch sconce, dark mortar",
    "background": "fills entire frame",
    "palette": "grey stone, green moss, warm torch light"
}
```

### Plain Text (quick / simple)

```
a red mushroom, pixel art style, dark background, centered
```

## Image-to-Image Prompt Patterns

When using `--input-images` / `input_images`, phrasing matters. Include these patterns to guide the model:

| Goal | Key phrases to include |
|------|----------------------|
| Pose variant | "same character as reference", describe new pose |
| Color variant | "same bottle/shape as reference", describe new color |
| Style consistency | "same art style as reference image", describe new subject |
| Animation frame | "same character", describe frame-specific pose |
| Palette swap | "same design as reference", describe new palette/colors |

### Examples

**Animation frames** — generate a base, then reference it for each pose:
```
Base: {"subject":"knight character", "style":"2D sprite", "pose":"idle, facing right"}
Walk: {"subject":"knight character", "style":"2D sprite, same character as reference", "pose":"walking, right foot forward"}
```

**Color variants** — generate one, reference it for recolors:
```
Base: "health potion bottle, red liquid, pixel art, dark background"
Variant: "mana potion bottle, blue liquid, pixel art, dark background, same bottle shape as reference"
```

**Style-consistent set** — use first asset as style anchor:
```
{"subject":"wooden shield", "style":"same art style as reference image, inventory icon", "view":"centered, 3/4 angle", "background":"solid dark"}
```

## Tips

- Always specify the background (e.g., "solid dark background", "solid color") — the model doesn't generate transparency, so a uniform background is easiest to remove in post-processing.
- Include the art style explicitly: "pixel art", "hand-painted", "cel-shaded", "clean vector", etc.
- Mention "centered" or "fills frame" to control composition.
- Use "game-ready" or "sprite sheet" language to bias toward clean, usable output.
- Keep total prompt length under ~200 words for best results.
