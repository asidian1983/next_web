# Known Issues & Limitations

---

## Critical

### [AI-001] AI service is a mock — no real model

**Severity:** Critical for production  
**Affects:** `apps/ai`

`generator.py`, `analyzer.py`, and `prompt_enhancer.py` are Pillow-based stubs. Generated "images" are 2D geometric pattern drawings with the prompt text watermarked. No ML model (Stable Diffusion, DALL-E, etc.) is integrated.

**To fix:** Replace the three service files with a real model implementation. Keep the `JobStatus` schema and SSE event format unchanged.

---

### [AI-002] In-process job store breaks with multiple workers

**Severity:** Critical for production  
**Affects:** `apps/ai/services/job_store.py`

`_store` is a plain Python `dict` held in process memory. The Dockerfile deploys with `--workers 2`, so each worker has its own copy. A job submitted to worker A cannot be polled or streamed from worker B — requests will return 404.

**To fix:** Replace `job_store.py` with a Redis-backed store before deploying with `workers > 1`.

---

### [INFRA-001] Kubernetes secrets contain placeholder values

**Severity:** Critical before any real deployment  
**Affects:** `k8s/api/deployment.yaml`, `k8s/ai/deployment.yaml`, `k8s/postgres/deployment.yaml`, `k8s/redis/deployment.yaml`

All `kind: Secret` blocks contain base64-encoded placeholder strings (`changeme_jwt_secret_at_least_32_chars`, etc.). Applying these to a real cluster exposes the system with known credentials.

**To fix:** Replace inline secrets with Sealed Secrets, External Secrets Operator, or inject via CI/CD. Never commit real secrets to git.

---

## High

### [API-001] Favorite toggle has a race condition

**Severity:** High  
**Affects:** `apps/api/src/designs/designs.service.ts` — `toggleFavorite`

Three separate DB round-trips (find → create/delete → update `likesCount`) are not wrapped in a Prisma transaction. Concurrent toggles by two clients can corrupt `likesCount`.

**To fix:** Wrap in `prisma.$transaction([...])`.

---

### [AUTH-001] 401 interceptor leaves Zustand store and cookie stale

**Severity:** High  
**Affects:** `apps/web/lib/api.ts` — Axios response interceptor

On a 401 response, the interceptor clears `localStorage.auth_token` and redirects to `/login`, but does not call `clearAuth()`. The Zustand persisted store (`auth-storage` in localStorage) and the `auth-token` cookie remain populated. A page refresh after the redirect may re-authenticate the user silently with a stale token.

**To fix:** Call `useAuthStore.getState().clearAuth()` inside the 401 interceptor, or import and call `clearAuth` directly.

---

### [INFRA-002] ConfigMap key mismatch between files and deployments

**Severity:** High  
**Affects:** `k8s/api/` and `k8s/web/`

- `k8s/api/configmap.yaml` defines `FASTAPI_URL` but `k8s/api/deployment.yaml` reads `AI_SERVICE_URL` — these will not resolve.
- `k8s/web/configmap.yaml` and the embedded ConfigMap in `k8s/web/deployment.yaml` define `web-config` with different keys (`NEXT_PUBLIC_AI_URL` only in the deployment copy).

**To fix:** Unify the key names. Remove the embedded ConfigMap from deployment YAMLs; reference only the standalone configmap files.

---

## Medium

### [WEB-001] Two nav routes lead to missing pages

**Severity:** Medium  
**Affects:** `apps/web/components/Sidebar.tsx`

`/designs` and `/settings` appear as sidebar navigation items but have no `page.tsx`. Clicking them serves the Next.js 404 page.

**To fix:** Implement the pages, add a "Coming soon" redirect, or remove the nav items.

---

### [WEB-002] `GenerateForm` component is unused dead code

**Severity:** Medium  
**Affects:** `apps/web/components/designs/GenerateForm.tsx`

A fully-built generate form using polling (`useJobStatus`) is imported nowhere. The active generate page reimplements the UI inline using SSE. The two implementations also define different style lists — 8 styles in `GenerateForm` vs. what `StylePresetGrid` uses.

**To fix:** Remove `GenerateForm.tsx` if SSE is the intended approach, or document it as a polling fallback and wire it up.

---

### [WEB-003] `NEXT_PUBLIC_API_URL` read in 8 separate places

**Severity:** Medium  
**Affects:** `apps/web`

`process.env.NEXT_PUBLIC_API_URL` is read directly in 7 files, bypassing `lib/env.ts`. If the variable is renamed, 7 sites break silently.

**To fix:** Import from `lib/env.ts` everywhere.

---

### [API-002] Job status write-back is not idempotent

**Severity:** Medium  
**Affects:** `apps/api/src/designs/designs.service.ts` — `getJobStatus`

Every poll of `GET /designs/job/:jobId` writes the current status back to PostgreSQL. Concurrent polls (e.g. from two browser tabs) will issue concurrent writes for the same transition, which is harmless but wasteful and could mask future issues.

**To fix:** Only write back if the status has changed: `if (dbDesign.status !== aiStatus) { await prisma.design.update(...) }`.

---

### [AI-003] Batch items' `width`/`height` are silently ignored

**Severity:** Medium  
**Affects:** `apps/ai/routers/generate.py` — `POST /generate/batch`

`BatchGenerateRequest.prompts` is typed as `list[GenerateRequest]`, so callers can provide per-item dimensions. These are silently ignored; only the top-level `width`/`height` apply to all jobs.

**To fix:** Use a dedicated `BatchPromptItem` model with only `prompt` and `style`, or respect per-item dimensions.

---

## Low

### [AI-004] `/analyze` errors are silently swallowed

**Severity:** Low  
**Affects:** `apps/ai/routers/analyze.py`

Any exception during image analysis returns `{ "tags": [] }` with HTTP 200, with only a log line. The NestJS caller also silently swallows analyze failures (returns `[]` tags).

---

### [AI-005] SSE stream has no heartbeat

**Severity:** Low (becomes high with real long-running models)  
**Affects:** `apps/ai/routers/generate.py` — `GET /jobs/:jobId/stream`

No SSE comment frames are emitted. Proxies or load balancers with short idle timeouts may silently terminate the connection during long generations.

---

### [INFRA-003] No CI/CD pipeline

**Severity:** Low  
**Affects:** `.github/` (missing)

No GitHub Actions workflow exists. The `make build` target uses `latest` image tags and builds against the local Docker daemon only. There is no documented process for tagging releases, pushing to a registry, or triggering a deploy on merge.
