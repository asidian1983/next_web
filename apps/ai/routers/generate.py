import asyncio
import json
import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse

from models.schemas import (
    BatchGenerateRequest,
    BatchGenerateResponse,
    GenerateRequest,
    GenerateResponse,
    JobStatus,
)
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
        progress=job.get("progress", 0),
        enhanced_prompt=job.get("enhanced_prompt"),
    )


@router.get("/jobs/{job_id}/stream")
async def stream_job_status(job_id: str) -> StreamingResponse:
    async def event_generator():
        while True:
            job = get_job(job_id)
            if job is None:
                yield f"data: {json.dumps({'error': 'not found'})}\n\n"
                break
            payload = JobStatus(
                job_id=job_id,
                status=job["status"],
                image_url=job.get("image_url"),
                error=job.get("error"),
                progress=job.get("progress", 0),
                enhanced_prompt=job.get("enhanced_prompt"),
            )
            yield f"data: {json.dumps(payload.dict())}\n\n"
            if job["status"] in ("done", "failed"):
                break
            await asyncio.sleep(0.5)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/generate/batch", response_model=BatchGenerateResponse, status_code=202)
async def generate_batch(
    request: BatchGenerateRequest, background_tasks: BackgroundTasks
) -> BatchGenerateResponse:
    if len(request.prompts) > 4:
        raise HTTPException(status_code=422, detail="Maximum 4 prompts allowed per batch")
    if len(request.prompts) == 0:
        raise HTTPException(status_code=422, detail="At least one prompt is required")

    jobs: list[GenerateResponse] = []
    for item in request.prompts:
        job_id = str(uuid.uuid4())
        create_job(job_id)
        background_tasks.add_task(
            run_generation,
            job_id,
            item.prompt,
            item.style,
            request.width,
            request.height,
        )
        jobs.append(GenerateResponse(job_id=job_id, status="pending"))

    return BatchGenerateResponse(jobs=jobs)
