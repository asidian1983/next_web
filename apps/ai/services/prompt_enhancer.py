_STYLE_MATERIAL_HINTS: dict[str, str] = {
    "realistic": "woven cotton fabric, natural fiber texture",
    "floral": "floral embroidery, silk fabric, botanical motif",
    "geometric": "jacquard weave, structured pattern, precision cut",
    "abstract": "hand-dyed textile, fluid brushwork, expressive fiber art",
    "minimal": "fine linen, clean weave, understated elegance",
    "vintage": "aged damask, antique brocade, heirloom textile",
    "modern": "technical fabric, contemporary weave, clean geometry",
    "traditional": "artisan handcraft, heritage pattern, traditional loom",
}

_STYLE_TEXTURE_DESCRIPTORS: dict[str, str] = {
    "realistic": "fine weave detail, natural drape",
    "floral": "soft petal texture, delicate stitching",
    "geometric": "sharp edges, repeat precision",
    "abstract": "organic texture, layered depth",
    "minimal": "smooth surface, subtle sheen",
    "vintage": "worn patina, rich depth",
    "modern": "crisp finish, contemporary feel",
    "traditional": "intricate detail, rich ornamentation",
}

_QUALITY_ENHANCERS = "high resolution, detailed textile, fabric texture, professional photography"


async def enhance_prompt(prompt: str, style: str) -> str:
    """
    Enrich user prompt with textile-specific vocabulary.
    Returns enhanced prompt for better generation.
    """
    style_key = style.lower()
    material = _STYLE_MATERIAL_HINTS.get(style_key, "quality textile, fabric material")
    texture = _STYLE_TEXTURE_DESCRIPTORS.get(style_key, "detailed texture")

    additions = f"{material}, {texture}, {_QUALITY_ENHANCERS}"
    enhanced = f"{prompt}, {additions}"

    # Truncate to max 200 chars
    if len(enhanced) > 200:
        enhanced = enhanced[:197] + "..."

    return enhanced
