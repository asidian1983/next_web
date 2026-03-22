from typing import Any


# In-memory job store: job_id -> dict with status, image_url, error
_store: dict[str, dict[str, Any]] = {}


def create_job(job_id: str) -> None:
    _store[job_id] = {"status": "pending", "image_url": None, "error": None}


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
