import asyncio
import os
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from services.job_store import update_job

GENERATED_DIR = Path(__file__).parent.parent / "static" / "generated"
GENERATED_DIR.mkdir(parents=True, exist_ok=True)

# Pastel color palettes keyed by style name
_STYLE_COLORS: dict[str, list[tuple[int, int, int]]] = {
    "realistic": [(220, 210, 200), (200, 215, 225), (210, 220, 205)],
    "abstract": [(255, 200, 200), (200, 200, 255), (200, 255, 200)],
    "geometric": [(255, 230, 180), (180, 230, 255), (230, 180, 255)],
    "floral": [(255, 210, 220), (210, 255, 210), (255, 255, 200)],
    "minimal": [(240, 240, 240), (230, 235, 240), (245, 240, 230)],
}
_DEFAULT_COLORS = [(230, 220, 210), (210, 230, 220), (220, 210, 230)]


def _pick_colors(style: str) -> tuple[tuple[int, int, int], tuple[int, int, int]]:
    palette = _STYLE_COLORS.get(style.lower(), _DEFAULT_COLORS)
    bg = random.choice(palette)
    # Slightly darker for pattern lines
    line_color = tuple(max(0, c - 40) for c in bg)  # type: ignore[assignment]
    return bg, line_color


def _draw_fabric_pattern(
    draw: ImageDraw.ImageDraw,
    width: int,
    height: int,
    line_color: tuple[int, int, int],
    style: str,
) -> None:
    step = 32
    if style.lower() == "geometric":
        # Diagonal lines
        for offset in range(-height, width + height, step):
            draw.line([(offset, 0), (offset + height, height)], fill=line_color, width=1)
            draw.line([(offset, 0), (offset - height, height)], fill=line_color, width=1)
    else:
        # Simple grid
        for x in range(0, width, step):
            draw.line([(x, 0), (x, height)], fill=line_color, width=1)
        for y in range(0, height, step):
            draw.line([(0, y), (width, y)], fill=line_color, width=1)


def _wrap_text(text: str, max_chars: int = 28) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        if len(current) + len(word) + 1 <= max_chars:
            current = f"{current} {word}".strip()
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [""]


def _generate_image(
    job_id: str,
    prompt: str,
    style: str,
    width: int,
    height: int,
) -> str:
    bg_color, line_color = _pick_colors(style)

    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    _draw_fabric_pattern(draw, width, height, line_color, style)

    # Attempt to load a default font; fall back to bitmap default
    try:
        font_prompt = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size=max(18, width // 26))
        font_watermark = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size=max(12, width // 40))
        font_style = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size=max(14, width // 34))
    except (IOError, OSError):
        font_prompt = ImageFont.load_default()
        font_watermark = font_prompt
        font_style = font_prompt

    text_color = (60, 60, 60)

    # Draw wrapped prompt text centered
    lines = _wrap_text(prompt, max_chars=max(10, width // 14))
    line_height = max(22, width // 22)
    total_text_height = len(lines) * line_height
    y_start = (height - total_text_height) // 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font_prompt)
        text_w = bbox[2] - bbox[0]
        x = (width - text_w) // 2
        y = y_start + i * line_height
        # Light shadow
        draw.text((x + 1, y + 1), line, fill=(180, 170, 160), font=font_prompt)
        draw.text((x, y), line, fill=text_color, font=font_prompt)

    # Style label (top-left)
    style_label = f"Style: {style}"
    draw.text((10, 10), style_label, fill=text_color, font=font_style)

    # "Textile AI" watermark (bottom-right)
    watermark = "Textile AI"
    wm_bbox = draw.textbbox((0, 0), watermark, font=font_watermark)
    wm_w = wm_bbox[2] - wm_bbox[0]
    wm_h = wm_bbox[3] - wm_bbox[1]
    draw.text((width - wm_w - 10, height - wm_h - 10), watermark, fill=(120, 110, 100), font=font_watermark)

    out_path = GENERATED_DIR / f"{job_id}.png"
    img.save(str(out_path), format="PNG")

    return f"/static/generated/{job_id}.png"


async def run_generation(
    job_id: str,
    prompt: str,
    style: str,
    width: int,
    height: int,
) -> None:
    update_job(job_id, "processing")
    # Simulate async processing delay (2-3 seconds)
    delay = random.uniform(2.0, 3.0)
    await asyncio.sleep(delay)
    try:
        # Run blocking Pillow work in thread pool to avoid blocking event loop
        loop = asyncio.get_running_loop()
        image_url = await loop.run_in_executor(
            None, _generate_image, job_id, prompt, style, width, height
        )
        update_job(job_id, "done", image_url=image_url)
    except Exception as exc:
        update_job(job_id, "failed", error=str(exc))
