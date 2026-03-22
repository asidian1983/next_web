from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000)
    style: str = Field(default="realistic")
    width: int = Field(default=512, ge=64, le=2048)
    height: int = Field(default=512, ge=64, le=2048)


class GenerateResponse(BaseModel):
    job_id: str
    status: str  # pending, processing, done, failed


class JobStatus(BaseModel):
    job_id: str
    status: str  # pending, processing, done, failed
    image_url: str | None = None
    error: str | None = None


class AnalyzeRequest(BaseModel):
    image_url: str


class AnalyzeResponse(BaseModel):
    tags: list[str]
