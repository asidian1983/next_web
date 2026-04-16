# System Architecture

## Overview

Textile AI Platform is a monorepo containing three application services and shared infrastructure.

```
apps/
  web/    Next.js 14 frontend         (port 3000)
  api/    NestJS 10 REST backend      (port 3001)
  ai/     FastAPI AI service          (port 8000)
```

---

## Service Topology

```
Browser
  |
  v
[Next.js :3000]
  |
  | HTTP (NEXT_PUBLIC_API_URL)
  v
[NestJS :3001]
  |  \
  |   \-- HTTP (FASTAPI_URL) --> [FastAPI :8000]
  |                                    |
  v                                    v
[PostgreSQL :5432]            /static/generated/
[Redis :6379]                 (PNG files on disk)
```

### Inter-Service Communication

| From | To | Protocol | Purpose |
|------|----|----------|---------|
| Browser | NestJS | HTTP REST + SSE | All user actions |
| NestJS | FastAPI | HTTP REST | Submit generate/batch/analyze jobs |
| NestJS | FastAPI | SSE proxy | Stream job progress to browser |
| NestJS | PostgreSQL | Prisma TCP | Persist all data |

> The AI service is an **internal-only** service — it has no public Ingress in Kubernetes.
> Authentication between NestJS and FastAPI is not implemented (trusted network assumed).

---

## Data Flow

### Design Generation Flow

```
1. Browser         POST /designs/generate          -> NestJS
2. NestJS          POST /generate                  -> FastAPI
3. FastAPI         202 { job_id, status: "pending" } -> NestJS
4. NestJS          saves Design(status=PENDING, jobId) -> Postgres
5. NestJS          { design }                      -> Browser
6. Browser         GET /designs/generate/:jobId/stream (SSE) -> NestJS
7. NestJS          GET /jobs/:jobId/stream (SSE proxy) -> FastAPI
8. FastAPI         runs background task, emits progress events -> NestJS -> Browser
9. FastAPI         status=done, image_url=/static/... -> stream closes
10. Browser        displays generated image
```

### Upload + Analyze Flow

```
1. Browser  POST /designs/upload (multipart)  -> NestJS
2. NestJS   saves file to /uploads/           -> disk
3. NestJS   POST /analyze { image_url }       -> FastAPI
4. FastAPI  { tags: [...] }                   -> NestJS
5. NestJS   saves Design(status=DONE, tags)   -> Postgres
6. NestJS   { design }                        -> Browser
```

---

## Database Schema

```
User
  id        cuid PK
  email     unique
  password  bcrypt hash
  name
  role      USER | ADMIN

Design
  id        cuid PK
  userId    FK -> User
  prompt
  style     default "realistic"
  imageUrl
  status    PENDING | PROCESSING | DONE | FAILED
  jobId     FK to FastAPI job
  width     default 512
  height    default 512
  title
  tags      String[]
  source    "generated" | "uploaded"
  isPublic  default false
  likesCount

Collection
  id        cuid PK
  userId    FK -> User
  name
  description

DesignCollection  (join)
  designId    FK -> Design  (cascade delete)
  collectionId FK -> Collection (cascade delete)

Favorite  (join)
  userId    FK -> User
  designId  FK -> Design  (cascade delete)
```

---

## Authentication

1. Login → `POST /auth/login` → returns `{ token, user }`
2. Token stored in `localStorage` (key: `auth_token`) and cookie (`auth-token`, 7 days)
3. Axios interceptor attaches `Authorization: Bearer <token>` to all API requests
4. Next.js middleware reads `auth-token` cookie for server-side route protection
5. On 401 response, Axios interceptor clears `localStorage.auth_token` and redirects to `/login`

> **Known limitation**: The 401 interceptor does not call `clearAuth()`, leaving the Zustand
> persisted store and cookie populated. A full logout only happens via the explicit logout action.

---

## Key Design Decisions

| Decision | Detail |
|----------|--------|
| JWT, no refresh tokens | Token expires in 7 days (configurable). No refresh mechanism exists. |
| `likesCount` denormalized | Stored on `Design` for read performance. Updated via two separate DB calls (race condition possible under concurrent toggles). |
| SSE proxy | NestJS pipes the FastAPI SSE stream directly to the browser — no reframing or heartbeats added. |
| AI service is mocked | `generator.py`, `analyzer.py`, and `prompt_enhancer.py` are Pillow-based stubs. No real ML model is used. See [AI Service Mock Note](#ai-service-mock-note). |

---

## AI Service Mock Note

The FastAPI service does **not** use any real AI/ML model. All generation is performed with Pillow (PIL):

- `services/generator.py` — draws deterministic 2D textile patterns (8 named styles)
- `services/analyzer.py` — returns random tags from a hardcoded textile vocabulary
- `services/prompt_enhancer.py` — appends hardcoded textile words to the prompt string

This is intentional scaffolding. To integrate a real model (Stable Diffusion, DALL-E, etc.), replace the contents of these three files while keeping the `JobStatus` schema and SSE event format unchanged.

---

## Infrastructure

See [DEVELOPMENT.md](./DEVELOPMENT.md) for local dev setup.
See [k8s/](../k8s/) for Kubernetes manifests.

### Kubernetes Namespace

All resources live in the `textile-ai` namespace.

### Service Resources

| Service | Replicas | HPA | CPU req/limit | Mem req/limit |
|---------|----------|-----|--------------|--------------|
| web | 2 (min) / 10 (max) | CPU 70% | 250m / 500m | 256Mi / 256Mi |
| api | 2 (min) / 8 (max) | CPU 70%, Mem 80% | 250m / 500m | 256Mi / 512Mi |
| ai | 1 (no HPA) | — | 500m / 1000m | 512Mi / 1Gi |
| postgres | 1 | — | 250m / 500m | 256Mi / 512Mi |
| redis | 1 | — | 100m / 250m | 128Mi / 256Mi |
