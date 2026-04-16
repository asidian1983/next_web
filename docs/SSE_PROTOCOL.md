# SSE Streaming Protocol

The job progress stream uses Server-Sent Events (SSE) to push real-time progress from the FastAPI AI service to the browser via a NestJS proxy.

---

## Endpoint

```
GET /designs/generate/:jobId/stream
Authorization: Bearer <token>
Accept: text/event-stream
```

NestJS acts as a **transparent proxy** — it forwards the FastAPI SSE stream directly to the browser without reframing or adding heartbeats.

Internally, NestJS calls:
```
GET http://<FASTAPI_URL>/jobs/:jobId/stream
```

---

## Event Format

Each event is a raw SSE `data:` frame containing a JSON payload:

```
data: {"job_id":"uuid","status":"processing","progress":25,"image_url":null,"enhanced_prompt":"...","error":null}

data: {"job_id":"uuid","status":"processing","progress":75,"image_url":null,"enhanced_prompt":"...","error":null}

data: {"job_id":"uuid","status":"done","progress":100,"image_url":"http://localhost:8000/static/generated/uuid.png","enhanced_prompt":"indigo batik...","error":null}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `job_id` | string | UUID of the job |
| `status` | string | `pending` \| `processing` \| `done` \| `failed` |
| `progress` | number | 0–100 |
| `image_url` | string \| null | Absolute URL to generated PNG. Set when `status === "done"`. |
| `enhanced_prompt` | string \| null | Prompt after enhancement. Set after processing begins. |
| `error` | string \| null | Error message if `status === "failed"`. |

> **Note:** All SSE payload fields use `snake_case`. This differs from all REST API responses which use `camelCase`. The frontend must handle this inconsistency.

---

## Progress Checkpoints

The current mock implementation emits progress at these fixed stages:

| Progress | Status | Meaning |
|----------|--------|---------|
| 0 | `pending` | Job created, not yet started |
| 25 | `processing` | Background task started |
| 75 | `processing` | Image rendering in progress |
| 100 | `done` | Image complete |

---

## Stream Lifecycle

```
1. Client opens SSE connection
2. FastAPI polls job state every 500ms
3. FastAPI emits a data: frame on each poll
4. When status is "done" or "failed", FastAPI closes the stream
5. NestJS propagates the close to the browser
```

The stream closes **immediately** after the terminal event — there is no trailing flush or delay.

---

## Termination

The stream ends naturally when FastAPI closes it (status `done` or `failed`).

The job ID not found case returns HTTP 404 before the stream is established.

---

## Client Implementation Notes

### Frontend (useGenerate hook)

The frontend uses a raw `fetch` SSE client (not `EventSource`), enabling cancellation via a closure:

```typescript
const cancel = trackProgress(jobId, (progress: JobProgress) => {
  // called for each SSE event
});

// cancel the stream:
cancel();
```

The client splits raw stream bytes by `\n`, strips the `data: ` prefix, and parses JSON. It stops on the `[DONE]` sentinel or when `status` is `done` or `failed`.

### Known Limitations

1. **No heartbeat frames** — proxies or load balancers with short idle timeouts (e.g. 30s) may close the connection silently during long generations. If a real model takes >30s, add SSE comment lines (`: keep-alive`) every ~15s.

2. **No reconnect** — if the connection drops mid-generation, the frontend has no automatic reconnect. Fall back to polling `GET /designs/job/:jobId` every 2s as a recovery mechanism.

3. **Multi-worker unsafe** — the FastAPI job store is in-process memory. With `--workers 2`, a job created by worker A cannot be streamed from worker B. Replace `job_store.py` with Redis before using multiple workers.

4. **NestJS adds no error normalization** — if the FastAPI stream emits an error event or drops, the NestJS proxy propagates the raw bytes. The browser may see a partial JSON frame or an abrupt close.

---

## Replacing the Mock

When integrating a real model, keep these contracts unchanged:

- Endpoint path: `GET /jobs/{job_id}/stream`
- Event format: `data: <JobStatus JSON>\n\n`
- Field names: `job_id`, `status`, `progress`, `image_url`, `enhanced_prompt`, `error`
- Terminal condition: `status === "done"` or `status === "failed"`
- `image_url` must be an absolute URL accessible by the browser

The NestJS proxy and frontend SSE client require no changes as long as these contracts hold.
