import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException

from models.schemas import GenerateRequest, GenerateResponse, JobStatus
from services.generator import run_generation
from services.job_store import create_job, get_job

router = APIRouter(tags=["generate"])


@router.post("/generate", response_model=GenerateResponse, status_code=202)
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks) -> GenerateResponse:
    job_id = str(uuid.uuid4())
    create_job(job_id)
    background_tasks.add_task(
        run_generation,
        job_id,
        request.prompt,
        request.style,
        request.width,
        request.height,
    )
    return GenerateResponse(job_id=job_id, status="pending")


@router.get("/jobs/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str) -> JobStatus:
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")
    return JobStatus(
        job_id=job_id,
        status=job["status"],
        image_url=job.get("image_url"),
        error=job.get("error"),
    )
