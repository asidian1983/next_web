# Development Guide

## Prerequisites

- Docker + Docker Compose
- Node.js 20+ (for local frontend dev without Docker)
- Python 3.11+ (for local AI dev without Docker)
- tmux (optional, for multi-pane workspace)

---

## Quick Start (Docker Compose)

```bash
# 1. Clone the repo
git clone <repo-url>
cd next_web

# 2. Set up environment variables
cp .env.example .env
# Edit .env and fill in required values (at minimum: JWT_SECRET)

# 3. Start all services
make dev

# 4. Verify services are up
make health
```

| Service | URL |
|---------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API (NestJS) | http://localhost:3001 |
| AI Service (FastAPI) | http://localhost:8000 |
| API Health | http://localhost:3001/health |
| AI Health | http://localhost:8000/health |

---

## Environment Variables

Copy `.env.example` to `.env` at the repo root and fill in values.

### Frontend (`apps/web`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3001` | NestJS backend base URL |

### Backend (`apps/api`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | HMAC secret for JWT signing (min 32 chars) |
| `JWT_EXPIRATION` | No | `7d` | Token lifetime (`1d`, `7d`, etc.) |
| `FASTAPI_URL` | No | `http://localhost:8000` | FastAPI AI service base URL |
| `PORT` | No | `3001` | NestJS listening port |
| `CORS_ORIGINS` | No | `http://localhost:3000,http://localhost:3001` | Allowed CORS origins (comma-separated) |
| `THROTTLE_TTL` | No | `60` | Rate limit window in seconds |
| `THROTTLE_LIMIT` | No | `100` | Max requests per window |

### AI Service (`apps/ai`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CORS_ORIGINS` | No | `http://localhost:3000,http://localhost:3001` | Allowed CORS origins |

> The AI service currently uses no external APIs or databases — no additional secrets required.
> When replacing the mock with a real model, add `OPENAI_API_KEY`, `HF_TOKEN`, etc. here.

---

## Makefile Targets

```bash
make dev          # Start all services (docker-compose up -d)
make dev-logs     # Tail logs from all services
make build        # Build all Docker images
make deploy       # Deploy to Kubernetes via kustomize
make health       # Run health checks
make rollback     # Rollback last Kubernetes deployment
```

---

## Database

Prisma manages the schema and migrations.

```bash
# Apply migrations (runs automatically on docker-compose up via api entrypoint)
cd apps/api
npx prisma migrate dev       # create + apply migration (dev)
npx prisma migrate deploy    # apply pending migrations (prod / CI)

# Open Prisma Studio
npx prisma studio

# Reset database (drops all data)
npx prisma migrate reset
```

The `DATABASE_URL` format:
```
postgresql://USER:PASSWORD@HOST:5432/textile_ai?schema=public
```

Docker Compose default: `postgresql://postgres:postgres@postgres:5432/textile_ai`

---

## tmux Multi-Agent Workspace

`./tmux.sh` opens a 4-pane tmux session (`ai-dev`) with one pane per service directory, each running `claude` (Claude Code).

This is an **AI-assisted development workflow** — it does not start the application services.
Run `make dev` separately before or after opening tmux.

```
Pane layout:
  [0] apps/web  (frontend)  [1] apps/api  (backend)
  [2] apps/ai   (ai)        [3] .         (infra/root)
```

---

## Running Services Individually

### Frontend

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
```

### Backend

```bash
cd apps/api
npm install
npx prisma migrate dev
npm run start:dev    # http://localhost:3001
```

### AI Service

```bash
cd apps/ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Kubernetes (k3s)

```bash
# Build and tag images
make build

# Deploy everything (ordered: namespace -> storage -> postgres -> redis -> ai -> api -> web)
./scripts/deploy.sh prod <git-sha>

# Or apply directly
kubectl apply -k k8s/

# Check rollout status
kubectl rollout status deployment/web -n textile-ai
kubectl rollout status deployment/api -n textile-ai
kubectl rollout status deployment/ai  -n textile-ai
```

**Ingress hosts (add to `/etc/hosts` for local k3s):**
```
127.0.0.1  web.textile.local
127.0.0.1  api.textile.local
```

> **Warning:** The k8s Secret manifests contain placeholder base64 values.
> Replace all `changeme_*` values before deploying to any real environment.
> See `k8s/api/deployment.yaml`, `k8s/ai/deployment.yaml`, `k8s/postgres/deployment.yaml`, `k8s/redis/deployment.yaml`.

---

## Known Issues

See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for a full list of documented limitations and bugs.
