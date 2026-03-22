from typing import Any


# In-memory job store: job_id -> dict with status, image_url, error, progress, enhanced_prompt
_store: dict[str, dict[str, Any]] = {}


def create_job(job_id: str) -> None:
    _store[job_id] = {
        "status": "pending",
        "image_url": None,
        "error": None,
        "progress": 0,
        "enhanced_prompt": None,
    }


def get_job(job_id: str) -> dict[str, Any] | None:
    return _store.get(job_id)


def update_job(
    job_id: str,
    status: str,
    image_url: str | None = None,
    error: str | None = None,
) -> None:
    if job_id in _store:
        _store[job_id]["status"] = status
        if image_url is not None:
            _store[job_id]["image_url"] = image_url
        if error is not None:
            _store[job_id]["error"] = error


def update_job_progress(job_id: str, progress: int) -> None:
    if job_id in _store:
        _store[job_id]["progress"] = progress


def set_enhanced_prompt(job_id: str, enhanced_prompt: str) -> None:
    if job_id in _store:
        _store[job_id]["enhanced_prompt"] = enhanced_prompt
