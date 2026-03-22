from fastapi import APIRouter

from models.schemas import AnalyzeRequest, AnalyzeResponse
from services.analyzer import analyze_image

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    try:
        tags = await analyze_image(request.image_url)
    except Exception:
        tags = []
    return AnalyzeResponse(tags=tags)
