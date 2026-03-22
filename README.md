# Textile AI Platform

A monorepo containing three services for an AI-powered textile design platform.

| Service | Stack | Port |
|---------|-------|------|
| `apps/web` | Next.js 14 | 3000 |
| `apps/api` | NestJS + Prisma | 3001 |
| `apps/ai` | FastAPI + Uvicorn | 8000 |

---

## Quick Start (Docker Compose)

### 1. Prerequisites

- Docker >= 24.0
- Docker Compose >= 2.20
- Node.js >= 20 (for local development without Docker)

### 2. Environment setup

```bash
cp .env.example .env
# Edit .env and fill in real values (JWT_SECRET, OPENAI_API_KEY, etc.)
```

### 3. Start all services

```bash
npm run dev
# or detached:
npm run dev:detach
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Open in browser

- Frontend: http://localhost:3000
- API: http://localhost:3001
- AI service: http://localhost:8000/docs (Swagger UI)

---

## Local Development (without Docker)

### Web (Next.js)

```bash
npm run dev:web
```

### API (NestJS)

```bash
npm run dev:api
```

### AI (FastAPI)

```bash
cd apps/ai
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm run dev:ai   # from repo root, or:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Docker Commands

```bash
# Build all images
npm run build

# View logs
npm run logs

# View logs for a specific service
npm run logs:web
npm run logs:api
npm run logs:ai

# Stop all services (keep volumes)
npm run stop

# Stop all services and remove volumes
npm run stop:volumes
```

---

## Kubernetes Deployment

### Prerequisites

- kubectl configured for your cluster
- Traefik ingress controller installed
- DNS / /etc/hosts entries for `web.textile.local` and `api.textile.local`

### 1. Build and push images

```bash
docker build -t textile-ai/web:latest apps/web
docker build -t textile-ai/api:latest apps/api
docker build -t textile-ai/ai:latest  apps/ai

# Tag and push to your registry, e.g.:
# docker tag textile-ai/web:latest registry.example.com/textile-ai/web:latest
# docker push registry.example.com/textile-ai/web:latest
```

### 2. Update secrets

Edit the `data` blocks in the Secret manifests (all values must be base64-encoded):

```bash
echo -n 'your_value' | base64
```

Secrets to update:
- `k8s/api/deployment.yaml` → `api-secrets`
- `k8s/ai/deployment.yaml`  → `ai-secrets`
- `k8s/postgres/deployment.yaml` → `postgres-secrets`
- `k8s/redis/deployment.yaml`    → `redis-secrets`

### 3. Apply manifests

```bash
# Namespace first
kubectl apply -f k8s/namespace.yaml

# Infrastructure
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/redis/

# Wait for postgres and redis to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n textile-ai --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis    -n textile-ai --timeout=120s

# Application services
kubectl apply -f k8s/api/
kubectl apply -f k8s/ai/
kubectl apply -f k8s/web/
```

### 4. Verify

```bash
kubectl get pods -n textile-ai
kubectl get ingress -n textile-ai
```

### GPU support (AI service)

Uncomment the GPU sections in `k8s/ai/deployment.yaml`:
- `nodeSelector`
- `tolerations`
- `resources.limits.nvidia.com/gpu`

---

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # NestJS backend
│   └── ai/           # FastAPI AI service
├── k8s/
│   ├── namespace.yaml
│   ├── web/
│   ├── api/
│   ├── ai/
│   ├── postgres/
│   └── redis/
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Environment Variables Reference

See `.env.example` for a full list of all environment variables with descriptions.
