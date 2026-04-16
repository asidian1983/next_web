# Textile AI Platform — CLAUDE.md

## 프로젝트 개요
AI 기반 텍스타일 디자인 생성 플랫폼. 사용자가 프롬프트를 입력하면 AI가 섬유 패턴 이미지를 생성한다.

## 모노레포 구조

```
next_web/
├── apps/
│   ├── web/          # Next.js 14 프론트엔드 (포트 3000)
│   ├── api/          # NestJS 백엔드 API (포트 3001)
│   └── ai/           # FastAPI AI 서비스 (포트 8000)
├── k8s/              # Kubernetes 매니페스트 (kustomize)
├── docker-compose.yml
├── tmux.sh           # 개발환경 멀티 pane 실행 스크립트
└── Makefile
```

## 서비스별 역할

### `apps/web` — Next.js 14 (TypeScript)
- **프레임워크**: Next.js 14, Tailwind CSS, Framer Motion
- **상태관리**: Zustand (`store/authStore`)
- **폼**: react-hook-form + zod
- **API 통신**: React Query + axios
- **디자인 시스템**: glass morphism (`bg-white/[0.04] border-white/[0.08] backdrop-blur-xl`)
- **주요 페이지**: `/`, `/login`, `/register`, `/dashboard`, `/generate`, `/gallery`, `/collections`, `/upload`, `/favorites`

### `apps/api` — NestJS (TypeScript)
- **프레임워크**: NestJS 10, Prisma ORM, PostgreSQL
- **인증**: JWT (passport-jwt)
- **주요 모듈**: `auth`, `designs`, `collections`, `ai`, `health`
- **파일업로드**: multer
- **보안**: helmet, throttler
- **DB 명령어**: `npm run prisma:migrate`, `npm run prisma:studio`

### `apps/ai` — FastAPI (Python)
- **프레임워크**: FastAPI, uvicorn
- **라우터**: `/generate`, `/analyze`, `/health`
- **외부 연동**: OpenAI API, HuggingFace

## 개발환경 실행

### 전체 실행 (권장)
```bash
./tmux.sh
```
4개 tmux pane이 자동으로 분할되어 각 서비스가 실행됨:
- **frontend** (좌측): `npm run dev`
- **backend** (우상단): `docker compose up api`
- **ai** (우중단): `docker compose up ai`
- **infra** (우하단): `docker compose up postgres redis`

### 개별 실행
```bash
# 인프라 (postgres + redis) 먼저
docker compose up postgres redis

# 백엔드
docker compose up api

# AI 서비스
docker compose up ai

# 프론트엔드 (로컬)
cd apps/web && npm run dev
```

### 전체 Docker
```bash
make dev          # docker-compose up -d
make dev-logs     # 로그 확인
make build        # 이미지 빌드
```

## 포트 맵

| 서비스 | 포트 |
|--------|------|
| Web (Next.js) | 3000 |
| API (NestJS) | 3001 |
| AI (FastAPI) | 8000 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## 환경변수

`docker-compose.yml` 기준 기본값:
- `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=textile_ai`
- `REDIS_PASSWORD=redis`
- `JWT_SECRET=changeme_jwt_secret`
- `NEXT_PUBLIC_API_URL=http://localhost:3001`
- `OPENAI_API_KEY`, `HF_TOKEN` — AI 서비스에 필요

## 코드 규칙

### 프론트엔드
- **Glass morphism 카드**: `bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl`
- **Ambient glow**: `bg-fabric-600/10 rounded-full blur-[120px]`
- **애니메이션**: framer-motion 사용, `initial={{ opacity: 0, y: 24 }}`
- **컬러 토큰**: `fabric-*`, `textile-*` (커스텀 Tailwind 색상)
- **컴포넌트 위치**: `components/ui/`, `components/layout/`, `components/designs/`

### 백엔드
- NestJS 모듈 패턴 준수 (module / controller / service / dto)
- DTO에 class-validator 데코레이터 필수
- Prisma 스키마 변경 시 `npm run prisma:migrate` 실행

### AI 서비스
- 라우터는 `routers/` 폴더, 비즈니스 로직은 `services/` 폴더
- Pydantic 스키마는 `models/schemas.py`

## 배포 (Kubernetes)

```bash
make deploy       # kubectl apply -k k8s/ + rollout 대기
make health       # 헬스체크 (scripts/health-check.sh)
make rollback     # 이전 버전으로 롤백
```

네임스페이스: `textile-ai`
