# API Reference

Base URL: `http://localhost:3001` (local dev) / `https://api.textile.local` (k8s)

All authenticated endpoints require `Authorization: Bearer <token>` header.

All responses are wrapped:
```json
{ "data": ..., "message": "..." }
```
All errors return:
```json
{ "statusCode": 4xx|5xx, "message": "...", "path": "...", "timestamp": "..." }
```

---

## Auth

### POST /auth/register

Create a new user account.

**No auth required.**

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "minlength8",
  "name": "ab"
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| email | string | valid email |
| password | string | min 8 chars |
| name | string | min 2 chars |

**Response 201:**
```json
{
  "data": {
    "user": { "id": "cuid", "email": "...", "name": "...", "role": "USER", "createdAt": "..." },
    "token": "jwt"
  }
}
```

---

### POST /auth/login

**No auth required.**

**Request body:**
```json
{ "email": "user@example.com", "password": "password123" }
```

**Response 200:** same shape as `/auth/register`

---

## Designs

### GET /designs

Get current user's designs (paginated, filterable).

**Auth required.**

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| search | string | searches prompt and title |
| tags | string | comma-separated tag filter |
| style | string | filter by style |
| source | string | `generated` or `uploaded` |
| page | number | default 1 |
| limit | number | default 20, max 100 |

**Response 200:**
```json
{
  "data": {
    "designs": [ /* Design[] */ ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET /designs/public

Get publicly visible designs.

**No auth required.** Same query params as `GET /designs`. Each design includes `user: { id, name }`.

---

### GET /designs/stats

Get generation statistics for the current user.

**Auth required.**

**Response 200:**
```json
{
  "data": {
    "total": 15,
    "byStatus": { "done": 12, "failed": 1, "pending": 0, "processing": 2 },
    "bySource": { "generated": 10, "uploaded": 5 },
    "thisMonth": 6
  }
}
```

---

### GET /designs/favorites

Get designs the current user has favorited (paginated).

**Auth required.** Query params: `page`, `limit`.

---

### GET /designs/:id

Get a single design. Ownership enforced.

**Auth required.**

---

### POST /designs/generate

Submit a single AI generation job.

**Auth required.**

**Request body:**
```json
{
  "prompt": "indigo batik with geometric patterns",
  "style": "geometric",
  "width": 512,
  "height": 512
}
```

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| prompt | string | 3–1000 chars | — |
| style | string | see valid styles | `"realistic"` |
| width | number | 256–1024 | 512 |
| height | number | 256–1024 | 512 |

**Valid style values:** `realistic`, `floral`, `geometric`, `abstract`, `minimal`, `vintage`, `modern`, `traditional`

**Response 201:** Updated design object with `jobId` populated.

---

### POST /designs/generate/batch

Submit up to 4 generation jobs at once.

**Auth required.**

**Request body:**
```json
{
  "prompts": [
    { "prompt": "blue weave", "style": "geometric" },
    { "prompt": "red floral", "style": "floral" }
  ]
}
```

**Response 201:**
```json
{ "data": [ /* Design[] with jobIds */ ] }
```

> Batch items share the same `width`/`height` (use the first item's values).

---

### GET /designs/job/:jobId

Poll AI job status and sync result to DB.

**Auth required.**

**Response 200:**
```json
{
  "data": {
    "job_id": "uuid",
    "status": "pending|processing|done|failed",
    "image_url": "http://localhost:8000/static/generated/uuid.png",
    "progress": 75,
    "enhanced_prompt": "...",
    "error": null
  }
}
```

---

### GET /designs/generate/:jobId/stream

SSE stream of job progress. NestJS proxies the FastAPI stream directly.

**Auth required.**

**Response:** `Content-Type: text/event-stream`

See [SSE_PROTOCOL.md](./SSE_PROTOCOL.md) for full event format.

---

### POST /designs/upload

Upload an image file. AI auto-tags it.

**Auth required.**

**Request:** `multipart/form-data`

| Field | Type | Constraints |
|-------|------|-------------|
| file | file | JPEG / PNG / WebP, max 10 MB |
| title | string | optional |
| description | string | optional |

**Response 201:** Design object with `source: "uploaded"`, `tags` populated, `status: "done"`.

---

### POST /designs/:id/favorite

Toggle favorite on a design.

**Auth required.**

**Response 200:**
```json
{ "data": { "isFavorited": true, "likesCount": 5 } }
```

---

### PATCH /designs/:id

Update design metadata. Ownership enforced.

**Auth required.**

**Request body (all optional):**
```json
{ "title": "...", "tags": ["tag1"], "isPublic": true, "style": "floral" }
```

---

### DELETE /designs/:id

Delete a design. Ownership enforced.

**Auth required.**

**Response 200.**

---

## Collections

All collection endpoints require auth.

### GET /collections

List current user's collections with design count.

**Response 200:**
```json
{
  "data": [
    { "id": "...", "name": "Spring 2024", "description": "...", "userId": "...", "createdAt": "...", "_count": { "designs": 3 } }
  ]
}
```

---

### POST /collections

Create a collection.

**Request body:**
```json
{ "name": "Spring 2024", "description": "Optional description" }
```

| Field | Constraints |
|-------|-------------|
| name | 1–200 chars |
| description | max 1000 chars |

---

### GET /collections/:id

Get collection with paginated designs. Query: `page`, `limit`.

---

### PATCH /collections/:id

Update name or description.

---

### DELETE /collections/:id

Delete collection and all its `DesignCollection` join rows.

---

### POST /collections/:id/designs

Add a design to a collection.

**Request body:** `{ "designId": "cuid" }`

Returns 409 if the design is already in the collection.

---

### DELETE /collections/:id/designs/:designId

Remove a design from a collection.

---

## Health

### GET /health

```json
{ "status": "ok", "timestamp": "...", "uptime": 123.45 }
```

### GET /health/ready

```json
{ "status": "ready" }
```

> Health endpoints do not probe the database or AI service — process liveness only.

---

## AI Service Endpoints (FastAPI :8000)

These are called by NestJS — not directly from the browser.

### POST /generate

```json
Request:  { "prompt": "...", "style": "geometric", "width": 512, "height": 512, "designId": "cuid" }
Response: { "job_id": "uuid", "status": "pending" }
```

### POST /generate/batch

```json
Request:  { "prompts": [ GenerateRequest ], "width": 512, "height": 512 }
Response: { "jobs": [ { "job_id": "uuid", "status": "pending", "designId": "cuid" } ] }
```

### GET /jobs/:jobId

```json
{
  "job_id": "uuid",
  "status": "pending|processing|done|failed",
  "image_url": "/static/generated/uuid.png",
  "progress": 75,
  "enhanced_prompt": "...",
  "error": null
}
```

### GET /jobs/:jobId/stream

SSE stream. See [SSE_PROTOCOL.md](./SSE_PROTOCOL.md).

### POST /analyze

```json
Request:  { "image_url": "http://..." }
Response: { "tags": ["cotton", "indigo", "geometric"] }
```

Errors are silently swallowed — returns `{ "tags": [] }` on failure.

### GET /health

```json
{ "status": "ok" }
```

### GET /ready

```json
{ "status": "ready" }
```
