# Skill: Generate Game Art via Local FLUX.2 API

A FLUX.2 Klein 9B image generation server runs at `http://172.22.22.100:8190`. Use it to generate 2D game assets on demand — sprites, icons, UI elements, characters, tilesets, and any visual asset needed during development. The API is async and queue-based: submit a job, poll until done, download the PNG.

**Dependency**: Only `requests` (standard in most environments). No GPU or ML libraries needed client-side.

## Quick Start

```bash
python3 .claude/skills/image-generation/scripts/generate.py \
  --prompt "a glowing health potion bottle, pixel art style, dark background" \
  --save-path assets/health_potion.png --width 512 --height 512 --seed 42
```

Output (stdout JSON): `{"job_id": "abc12345", "seed": 42, "save_path": "assets/health_potion.png"}`

## API Reference

### `POST /generate` (HTTP 202)

Submit a generation job. Returns immediately.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `prompt` | `str \| dict` | *required* | Text prompt or structured JSON object |
| `width` | `int` | 1024 | Image width (256–2048) |
| `height` | `int` | 1024 | Image height (256–2048) |
| `steps` | `int` | 20 | Denoising steps |
| `guidance_scale` | `float` | 5.0 | CFG scale |
| `seed` | `int \| null` | null | Random seed (null = random) |
| `input_images` | `list[str] \| null` | null | Reference images for i2i (file paths, data URIs, or base64) |

**Response**: `{"job_id": "abc12345", "status": "pending", "position": 0}`

### `GET /jobs/{job_id}`

Poll job status.

| Field | Values |
|-------|--------|
| `status` | `pending` → `processing` → `completed` \| `failed` |
| `output_path` | URL path when completed, e.g. `/outputs/abc12345.png` |
| `error` | Error message if failed |
| `position` | Queue position (only while pending) |

### `GET /outputs/{filename}`

Download a generated image. Full URL: `http://172.22.22.100:8190/outputs/abc12345.png`

### `GET /health`

Returns server status, model info, GPU name, VRAM, and queue size.

## Script Reference

Run `python3 .claude/skills/image-generation/scripts/generate.py --help` for full usage.

| Flag | Default | Description |
|------|---------|-------------|
| `--prompt` | *required* | Text or JSON dict string (auto-detected) |
| `--save-path` | *required* | Output PNG path (dirs auto-created) |
| `--width` | 1024 | Image width |
| `--height` | 1024 | Image height |
| `--seed` | random | Reproducibility seed |
| `--steps` | 20 | Denoising steps |
| `--guidance-scale` | 5.0 | CFG scale |
| `--input-images` | none | Reference image path(s) for i2i |
| `--server` | `http://172.22.22.100:8190` | API base URL |
| `--timeout` | 300 | Max wait seconds |
| `--poll-interval` | 2 | Seconds between polls |

### CLI Examples

```bash
# Text prompt
python3 .claude/skills/image-generation/scripts/generate.py \
  --prompt "wooden treasure chest, pixel art" \
  --save-path assets/sprites/chest.png --width 512 --height 512

# Dict prompt (JSON string)
python3 .claude/skills/image-generation/scripts/generate.py \
  --prompt '{"subject":"fire mage","style":"2D sprite","background":"solid dark","details":"casting pose"}' \
  --save-path assets/sprites/fire_mage.png --width 512 --height 768 --seed 100

# Image-to-image
python3 .claude/skills/image-generation/scripts/generate.py \
  --prompt "same character facing right, walking pose" \
  --save-path assets/sprites/fire_mage_walk.png \
  --input-images assets/sprites/fire_mage.png --width 512 --height 768
```

### Import for Batch Workflows

```python
sys.path.insert(0, ".claude/skills/image-generation/scripts")
from generate import generate_image

for enemy in ["slime", "skeleton", "bat"]:
    generate_image(f"{enemy}, 2D sprite, facing left", f"assets/enemies/{enemy}.png", width=512, height=512)
```

## Prompt Engineering

Dict prompts are recommended for game assets — the model reads JSON key-value structure for more controllable results. See [PROMPTS.md](PROMPTS.md) for templates (characters, UI, items, enemies, tilesets) and i2i prompt patterns.

## Common Asset Sizes

Generate at a larger resolution, then downscale in your game engine for crisp results.

| Asset Type | Generate At | Typical In-Game Size |
|------------|-------------|---------------------|
| Character sprite | 512×768 or 768×768 | 64×96 to 128×128 |
| Item / icon | 512×512 | 32×32 to 64×64 |
| UI element | 1024×256 or 512×512 | Varies |
| Tileset piece | 512×512 | 32×32 to 64×64 |
| Background / scene | 1024×768 or 1024×1024 | Full screen |
| Portrait / headshot | 512×512 or 512×768 | 128×128 to 256×256 |
| Large boss sprite | 1024×1024 | 128×128 to 256×256 |

## Image-to-Image

Use `--input-images` to condition generation on existing assets for visual consistency. The server VAE-encodes the reference and concatenates it with noise latents during denoising.

**Key detail:** There is no explicit `strength` parameter. The number of `steps` controls deviation from the reference — fewer steps = closer to reference, more steps = more creative freedom. Default 20 steps produces significant reinterpretation while keeping stylistic cues.

### Typical Workflows

**Animation frames** — generate a base pose with a fixed seed, then use it as `--input-images` for walk/attack/hurt poses.

**Color variants** — generate one item, then reference it with "same shape as reference" + new color descriptions.

**Style-consistent sets** — use your first generated asset as `--input-images` for all subsequent assets, even different subjects, to maintain a unified art style.

## Tips and Constraints

- **Check `/health` first.** If the server is down, inform the user and suggest starting it. Don't silently fail.
- **Single GPU worker.** Jobs are queued one at a time. Each image takes ~10–30s depending on resolution and steps.
- **No alpha channel.** Output is RGB PNG. For transparency, generate on a solid-color background and remove it in post-processing.
- **Seeds for reproducibility.** Always save and log the seed when generating assets you may want to reproduce.
- **Default parameters are optimal.** 20 steps and 5.0 guidance scale are tuned for this model.
- **Resolution range: 256–2048.** For game assets, 512×512 or 512×768 is the sweet spot.
- **Dict prompts > plain text** for structured game assets.
- **Server must be on same LAN.** `input_images` accepts local file paths, data URIs, or base64 strings.
