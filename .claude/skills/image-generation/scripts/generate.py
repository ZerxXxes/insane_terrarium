#!/usr/bin/env python3
"""Generate images via local FLUX.2 API.

CLI usage:
    python3 generate.py --prompt "a health potion, pixel art" --save-path out.png
    python3 generate.py --prompt '{"subject":"knight","style":"2D sprite"}' --save-path knight.png --width 512 --height 768

Importable:
    from generate import generate_image
    result = generate_image("a red mushroom, pixel art", "mushroom.png")
"""

import argparse
import json
import os
import requests
import sys
import time


def generate_image(
    prompt,
    save_path,
    width=1024,
    height=1024,
    seed=None,
    input_images=None,
    steps=20,
    guidance_scale=5.0,
    server_url="http://172.22.22.100:8190",
    poll_interval=2,
    timeout=300,
):
    """Generate an image and save it to a local file.

    Args:
        prompt: Text string or dict (structured prompt).
        save_path: Local path to save the PNG (directories created automatically).
        width/height: Image dimensions (256-2048, default 1024).
        seed: Reproducibility seed (None = random).
        input_images: List of reference image paths for image-to-image.
        steps: Denoising steps (default 20).
        guidance_scale: CFG scale (default 5.0).
        server_url: API base URL.
        poll_interval: Seconds between status checks.
        timeout: Max seconds to wait before giving up.

    Returns:
        dict with keys: job_id, seed, save_path

    Raises:
        RuntimeError: If generation fails or times out.
        ConnectionError: If the server is unreachable.
    """
    # Check server health
    try:
        health = requests.get(f"{server_url}/health", timeout=5).json()
        if not health.get("pipeline_loaded"):
            raise RuntimeError("Server is up but model not loaded yet")
    except requests.ConnectionError:
        raise ConnectionError(
            f"Image generation server not reachable at {server_url}. "
            "Start it with: python server.py (in the image-server directory)"
        )

    # Submit job
    payload = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "steps": steps,
        "guidance_scale": guidance_scale,
    }
    if seed is not None:
        payload["seed"] = seed
    if input_images:
        payload["input_images"] = input_images

    resp = requests.post(f"{server_url}/generate", json=payload)
    resp.raise_for_status()
    job_id = resp.json()["job_id"]

    # Poll until done
    deadline = time.time() + timeout
    while time.time() < deadline:
        status = requests.get(f"{server_url}/jobs/{job_id}").json()
        if status["status"] == "completed":
            # Download and save
            img_data = requests.get(f"{server_url}{status['output_path']}").content
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            with open(save_path, "wb") as f:
                f.write(img_data)
            return {"job_id": job_id, "seed": seed, "save_path": save_path}
        if status["status"] == "failed":
            raise RuntimeError(f"Generation failed: {status.get('error', 'unknown')}")
        time.sleep(poll_interval)

    raise RuntimeError(f"Generation timed out after {timeout}s (job_id={job_id})")


def main():
    parser = argparse.ArgumentParser(
        description="Generate images via local FLUX.2 API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='Example: python3 generate.py --prompt "a health potion, pixel art" --save-path potion.png',
    )
    parser.add_argument(
        "--prompt", required=True,
        help="Text prompt or JSON dict string (auto-detected)",
    )
    parser.add_argument(
        "--save-path", required=True,
        help="Output PNG path (dirs auto-created)",
    )
    parser.add_argument("--width", type=int, default=1024, help="Image width (default: 1024)")
    parser.add_argument("--height", type=int, default=1024, help="Image height (default: 1024)")
    parser.add_argument("--seed", type=int, default=None, help="Random seed (default: random)")
    parser.add_argument("--steps", type=int, default=20, help="Denoising steps (default: 20)")
    parser.add_argument("--guidance-scale", type=float, default=5.0, help="CFG scale (default: 5.0)")
    parser.add_argument(
        "--input-images", nargs="+", default=None,
        help="Reference image paths for image-to-image",
    )
    parser.add_argument("--server", default="http://172.22.22.100:8190", help="API base URL")
    parser.add_argument("--timeout", type=int, default=300, help="Max wait seconds (default: 300)")
    parser.add_argument("--poll-interval", type=int, default=2, help="Poll interval seconds (default: 2)")
    args = parser.parse_args()

    # Auto-detect JSON dict prompt
    prompt = args.prompt
    try:
        parsed = json.loads(prompt)
        if isinstance(parsed, dict):
            prompt = parsed
    except (json.JSONDecodeError, ValueError):
        pass

    try:
        result = generate_image(
            prompt=prompt,
            save_path=args.save_path,
            width=args.width,
            height=args.height,
            seed=args.seed,
            input_images=args.input_images,
            steps=args.steps,
            guidance_scale=args.guidance_scale,
            server_url=args.server,
            poll_interval=args.poll_interval,
            timeout=args.timeout,
        )
        print(json.dumps(result))
    except (RuntimeError, ConnectionError) as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
