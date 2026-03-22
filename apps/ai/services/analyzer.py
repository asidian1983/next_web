import asyncio
import os
import random


TEXTILE_VOCABULARY: dict[str, list[str]] = {
    "materials": ["cotton", "silk", "linen", "wool", "polyester", "denim", "velvet"],
    "patterns": ["floral", "geometric", "striped", "checkered", "abstract", "solid", "paisley"],
    "textures": ["woven", "knitted", "embroidered", "printed", "dyed"],
    "styles": ["traditional", "modern", "vintage", "minimalist"],
}

COLOR_HINTS = ["red", "blue", "green", "yellow", "black", "white", "pink", "purple", "orange", "brown", "grey", "gray"]


async def analyze_image(image_url: str) -> list[str]:
    """
    Mock analyzer: returns tags based on filename patterns + random textile tags.
    In production, this would use a vision model.
    """
    if not image_url or not image_url.strip():
        return []

    try:
        await asyncio.sleep(0.5)

        filename = os.path.basename(image_url).lower()
        tags: list[str] = []

        # Detect color hints from filename
        for color in COLOR_HINTS:
            if color in filename:
                tags.append(color)

        # Pick random tags from each category to reach 4-7 total tags
        all_vocab = (
            TEXTILE_VOCABULARY["materials"]
            + TEXTILE_VOCABULARY["patterns"]
            + TEXTILE_VOCABULARY["textures"]
            + TEXTILE_VOCABULARY["styles"]
        )

        target_count = random.randint(4, 7)
        # How many random tags we still need after color hints
        needed = max(3, target_count - len(tags))

        # Sample without replacement, excluding already-added tags
        pool = [t for t in all_vocab if t not in tags]
        random_tags = random.sample(pool, min(needed, len(pool)))
        tags.extend(random_tags)

        # Deduplicate while preserving order and cap at 7
        seen: set[str] = set()
        result: list[str] = []
        for tag in tags:
            if tag not in seen:
                seen.add(tag)
                result.append(tag)
            if len(result) == 7:
                break

        return result

    except Exception:
        return []
