import asyncio
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from services.job_store import update_job, update_job_progress, set_enhanced_prompt
from services.prompt_enhancer import enhance_prompt

GENERATED_DIR = Path(__file__).parent.parent / "static" / "generated"
GENERATED_DIR.mkdir(parents=True, exist_ok=True)

STYLE_CONFIGS: dict[str, dict] = {
    "realistic": {
        "colors": [(220, 210, 200), (200, 215, 225), (210, 220, 205), (215, 205, 195)],
        "pattern_type": "weave",
        "complexity": "high",
    },
    "floral": {
        "colors": [(255, 210, 220), (210, 255, 210), (255, 255, 200), (255, 230, 240)],
        "pattern_type": "floral",
        "complexity": "high",
    },
    "geometric": {
        "colors": [(255, 230, 180), (180, 230, 255), (230, 180, 255), (200, 240, 200)],
        "pattern_type": "geometric",
        "complexity": "medium",
    },
    "abstract": {
        "colors": [(255, 200, 200), (200, 200, 255), (200, 255, 200), (255, 240, 200)],
        "pattern_type": "abstract",
        "complexity": "high",
    },
    "minimal": {
        "colors": [(240, 240, 240), (230, 235, 240), (245, 240, 230), (238, 238, 238)],
        "pattern_type": "solid",
        "complexity": "low",
    },
    "vintage": {
        "colors": [(210, 190, 160), (180, 160, 130), (200, 180, 150), (190, 170, 140)],
        "pattern_type": "damask",
        "complexity": "high",
    },
    "modern": {
        "colors": [(70, 130, 180), (240, 240, 240), (50, 50, 50), (200, 60, 60)],
        "pattern_type": "chevron",
        "complexity": "medium",
    },
    "traditional": {
        "colors": [(180, 60, 60), (200, 160, 80), (60, 100, 60), (80, 60, 120)],
        "pattern_type": "paisley",
        "complexity": "high",
    },
}
_DEFAULT_CONFIG = {
    "colors": [(230, 220, 210), (210, 230, 220), (220, 210, 230)],
    "pattern_type": "weave",
    "complexity": "medium",
}


def _get_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in [
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size=size)
        except (IOError, OSError):
            continue
    return ImageFont.load_default()


def _draw_weave(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    step = 16
    c1 = colors[0]
    c2 = colors[1] if len(colors) > 1 else tuple(max(0, v - 30) for v in c1)
    for row in range(0, height, step):
        for col in range(0, width, step):
            offset = (row // step) % 2
            color = c1 if (col // step + offset) % 2 == 0 else c2
            draw.rectangle([col, row, col + step - 1, row + step - 1], fill=color)


def _draw_floral(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    spacing = 60
    petal_r = 12
    center_r = 8
    c_petal = colors[0]
    c_center = colors[1] if len(colors) > 1 else (255, 180, 180)
    c_leaf = colors[2] if len(colors) > 2 else (180, 220, 180)
    for cy in range(spacing // 2, height + spacing, spacing):
        for cx in range(spacing // 2, width + spacing, spacing):
            # Four petals (ellipses)
            for dx, dy in [(0, -petal_r - 6), (0, petal_r + 6), (-petal_r - 6, 0), (petal_r + 6, 0)]:
                draw.ellipse(
                    [cx + dx - petal_r, cy + dy - petal_r // 2,
                     cx + dx + petal_r, cy + dy + petal_r // 2],
                    fill=c_petal,
                )
            # Diagonal leaves
            for dx, dy in [(-petal_r - 4, -petal_r - 4), (petal_r + 4, petal_r + 4),
                           (petal_r + 4, -petal_r - 4), (-petal_r - 4, petal_r + 4)]:
                draw.ellipse(
                    [cx + dx - petal_r // 2, cy + dy - petal_r,
                     cx + dx + petal_r // 2, cy + dy + petal_r],
                    fill=c_leaf,
                )
            # Center circle
            draw.ellipse([cx - center_r, cy - center_r, cx + center_r, cy + center_r], fill=c_center)


def _draw_geometric(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    step = 48
    c1 = colors[0]
    c2 = colors[1] if len(colors) > 1 else (200, 200, 255)
    c3 = colors[2] if len(colors) > 2 else (255, 200, 200)
    for row in range(0, height + step, step):
        for col in range(0, width + step, step):
            # Diamond
            cx, cy = col + step // 2, row + step // 2
            half = step // 2 - 4
            draw.polygon(
                [(cx, cy - half), (cx + half, cy), (cx, cy + half), (cx - half, cy)],
                fill=c1 if (row // step + col // step) % 3 == 0 else (c2 if (row // step + col // step) % 3 == 1 else c3),
                outline=bg,
            )


def _draw_abstract(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    num_strokes = max(20, (width * height) // 4000)
    for _ in range(num_strokes):
        color = random.choice(colors)
        x0, y0 = random.randint(0, width), random.randint(0, height)
        # Bezier-like via segmented lines
        pts = [(x0, y0)]
        for _ in range(random.randint(3, 8)):
            pts.append((
                pts[-1][0] + random.randint(-width // 6, width // 6),
                pts[-1][1] + random.randint(-height // 6, height // 6),
            ))
        draw.line(pts, fill=color, width=random.randint(2, 8))


def _draw_solid(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    # Subtle vertical gradient
    c_top = colors[0]
    c_bot = colors[1] if len(colors) > 1 else tuple(max(0, v - 20) for v in c_top)
    for y in range(height):
        t = y / max(height - 1, 1)
        r = int(c_top[0] + (c_bot[0] - c_top[0]) * t)
        g = int(c_top[1] + (c_bot[1] - c_top[1]) * t)
        b = int(c_top[2] + (c_bot[2] - c_top[2]) * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def _draw_damask(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    spacing = 80
    c1 = colors[0]
    c2 = colors[1] if len(colors) > 1 else tuple(max(0, v - 40) for v in c1)
    for cy in range(spacing // 2, height + spacing, spacing):
        for cx in range(spacing // 2, width + spacing, spacing):
            # Outer oval
            r_outer = spacing // 2 - 6
            draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=c1, width=3)
            # Inner diamond
            half = r_outer // 2
            draw.polygon(
                [(cx, cy - half), (cx + half, cy), (cx, cy + half), (cx - half, cy)],
                fill=c2,
                outline=c1,
            )
            # Corner petals
            for dx, dy in [(spacing // 2, 0), (-spacing // 2, 0), (0, spacing // 2), (0, -spacing // 2)]:
                draw.ellipse(
                    [cx + dx - 6, cy + dy - 10, cx + dx + 6, cy + dy + 10],
                    fill=c1,
                )


def _draw_chevron(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    stripe_h = 28
    half_w = width // 2
    for i, y_start in enumerate(range(-stripe_h, height + stripe_h, stripe_h)):
        color = colors[i % len(colors)]
        # Left half going down-right, right half going up-right (V shape)
        draw.polygon(
            [
                (0, y_start),
                (half_w, y_start + stripe_h // 2),
                (width, y_start),
                (width, y_start + stripe_h),
                (half_w, y_start + stripe_h + stripe_h // 2),
                (0, y_start + stripe_h),
            ],
            fill=color,
        )


def _draw_paisley(draw: ImageDraw.ImageDraw, width: int, height: int, colors: list, bg: tuple) -> None:
    spacing = 70
    for row_i, cy in enumerate(range(spacing // 2, height + spacing, spacing)):
        for col_i, cx in enumerate(range(spacing // 2, width + spacing, spacing)):
            color = colors[(row_i + col_i) % len(colors)]
            outline_c = colors[(row_i + col_i + 1) % len(colors)]
            # Teardrop body: tall ellipse
            draw.ellipse([cx - 10, cy - 22, cx + 10, cy + 10], fill=color, outline=outline_c, width=2)
            # Curved tip: small circle offset
            draw.ellipse([cx + 4, cy - 28, cx + 16, cy - 16], fill=color, outline=outline_c, width=2)
            # Inner dot
            draw.ellipse([cx - 4, cy - 10, cx + 4, cy - 2], fill=outline_c)


_PATTERN_DRAWERS = {
    "weave": _draw_weave,
    "floral": _draw_floral,
    "geometric": _draw_geometric,
    "abstract": _draw_abstract,
    "solid": _draw_solid,
    "damask": _draw_damask,
    "chevron": _draw_chevron,
    "paisley": _draw_paisley,
}


def _draw_texture_overlay(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Subtle noise overlay to simulate fabric texture."""
    num_dots = (width * height) // 200
    for _ in range(num_dots):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        v = random.randint(0, 30)
        draw.point((x, y), fill=(v, v, v))


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
    config = STYLE_CONFIGS.get(style.lower(), _DEFAULT_CONFIG)
    colors = config["colors"]
    pattern_type = config["pattern_type"]
    bg_color = colors[0]

    # Layer 1: background
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Layer 2: pattern
    drawer = _PATTERN_DRAWERS.get(pattern_type, _draw_weave)
    drawer(draw, width, height, colors, bg_color)

    # Layer 3: texture overlay
    _draw_texture_overlay(draw, width, height)

    # Layer 4: text
    font_prompt = _get_font(max(18, width // 26))
    font_watermark = _get_font(max(12, width // 40))
    font_style = _get_font(max(14, width // 34))

    text_color = (40, 40, 40)

    lines = _wrap_text(prompt, max_chars=max(10, width // 14))
    line_height = max(22, width // 22)
    total_text_height = len(lines) * line_height
    y_start = (height - total_text_height) // 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font_prompt)
        text_w = bbox[2] - bbox[0]
        x = (width - text_w) // 2
        y = y_start + i * line_height
        # Shadow
        draw.text((x + 1, y + 1), line, fill=(200, 195, 190), font=font_prompt)
        draw.text((x, y), line, fill=text_color, font=font_prompt)

    # Style label (top-left)
    draw.text((10, 10), f"Style: {style}", fill=text_color, font=font_style)

    # Layer 5: watermark (bottom-right)
    watermark = "Textile AI"
    wm_bbox = draw.textbbox((0, 0), watermark, font=font_watermark)
    wm_w = wm_bbox[2] - wm_bbox[0]
    wm_h = wm_bbox[3] - wm_bbox[1]
    draw.text(
        (width - wm_w - 10, height - wm_h - 10),
        watermark,
        fill=(100, 95, 90),
        font=font_watermark,
    )

    out_path = GENERATED_DIR / f"{job_id}.png"
    img.save(str(out_path), format="PNG")
    return f"/static/generated/{job_id}.png"


async def generate_image(
    job_id: str,
    prompt: str,
    style: str,
    width: int,
    height: int,
    seed: int | None = None,
) -> str:
    if seed is not None:
        random.seed(seed)

    # Enhance prompt and record it
    enhanced = await enhance_prompt(prompt, style)
    set_enhanced_prompt(job_id, enhanced)

    update_job(job_id, "processing")
    update_job_progress(job_id, 0)

    # Step 1: background (0 -> 25%)
    await asyncio.sleep(0.5)
    update_job_progress(job_id, 25)

    # Step 2: pattern (25 -> 75%)
    await asyncio.sleep(0.5)
    update_job_progress(job_id, 75)

    # Step 3: run blocking Pillow work in thread pool
    loop = asyncio.get_running_loop()
    image_url = await loop.run_in_executor(
        None, _generate_image, job_id, enhanced, style, width, height
    )

    update_job_progress(job_id, 100)
    return image_url


async def run_generation(
    job_id: str,
    prompt: str,
    style: str,
    width: int,
    height: int,
    seed: int | None = None,
) -> None:
    try:
        image_url = await generate_image(job_id, prompt, style, width, height, seed)
        update_job(job_id, "done", image_url=image_url)
    except Exception as exc:
        update_job(job_id, "failed", error=str(exc))
