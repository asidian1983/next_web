# Infrastructure Tools

## 컨테이너

| 툴 | 버전 | 용도 |
|----|------|------|
| [Docker](https://docker.com) | Desktop 4.x | 컨테이너 런타임 |
| [Docker Compose](https://docs.docker.com/compose) | v2 (plugin) | 로컬 멀티 서비스 오케스트레이션 |
| [Docker Buildx](https://docs.docker.com/buildx) | — | 멀티 플랫폼 빌드, 레이어 캐시 |

> **주의:** `docker compose` (공백, v2 plugin) 사용. `docker-compose` (하이픈) 아님.

## 데이터베이스

| 툴 | 버전 | 포트 | 용도 |
|----|------|------|------|
| [PostgreSQL](https://postgresql.org) | 16 | 5432 | 메인 RDB |
| [Redis](https://redis.io) | 7 | 6379 | 캐시, 작업 큐 |

**기본 접속 정보 (개발):**
```
POSTGRES_DB=textile_ai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
REDIS_PASSWORD=redis
```

## Kubernetes

| 툴 | 용도 |
|----|------|
| [kubectl](https://kubernetes.io/docs/reference/kubectl) | 클러스터 관리 CLI |
| [kustomize](https://kustomize.io) | k8s 매니페스트 오버레이 (`k8s/kustomization.yaml`) |

**네임스페이스:** `textile-ai`

**주요 명령어:**
```bash
kubectl apply -k k8s/                              # 전체 배포
kubectl rollout status deployment/web -n textile-ai
kubectl get pods -n textile-ai
kubectl logs -f deployment/api -n textile-ai
make deploy   # 위 과정 자동화
make rollback # 이전 버전으로 롤백
```

## 포트 맵

| 서비스 | 컨테이너 내부 | 로컬 호스트 |
|--------|-------------|-------------|
| Web (Next.js) | 3000 | 3000 |
| API (NestJS) | 3001 | 3001 |
| AI (FastAPI) | 8000 | 8000 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |

## Docker 이미지 구조

모든 이미지는 3단계 멀티스테이지 빌드 사용:

```
Stage 1: deps    — 의존성 설치
Stage 2: builder — 소스 빌드
Stage 3: runner  — 최소 런타임 이미지
```

이미지 태그 형식:
```
textile-ai/web:latest
textile-ai/web:<git-sha>
```
