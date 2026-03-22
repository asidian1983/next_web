# Infra Agent — 작업 내역

## 담당 에이전트
`infra` — Docker 및 k3s 인프라 구성

## 작업 범위
루트 설정 파일 + `k8s/` + 각 서비스 `Dockerfile`

## 생성된 파일 목록 (19개 + 1개 수정)

### 루트 파일
| 파일 | 설명 |
|------|------|
| `docker-compose.yml` | 전체 스택 로컬 개발 환경 (web, api, ai, postgres, redis) |
| `package.json` | 모노레포 루트, `workspaces: ["apps/*"]`, 개발 스크립트 |
| `.env.example` | 전체 서비스 환경 변수 |
| `README.md` | 빠른 시작 가이드 |

### Dockerfile
| 파일 | 설명 |
|------|------|
| `apps/web/Dockerfile` | 3단계 빌드 (deps→builder→runner), Next.js standalone, non-root |
| `apps/api/Dockerfile` | 3단계 빌드, Prisma client 생성, openssl 포함, non-root |
| `apps/ai/Dockerfile` | 2단계 빌드, virtualenv, Pillow 시스템 라이브러리, non-root |

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `apps/web/next.config.ts` | `output: 'standalone'` 추가 (standalone Dockerfile 빌드 필요) |

### Kubernetes 매니페스트 (`k8s/`)
| 파일 | 설명 |
|------|------|
| `namespace.yaml` | `textile-ai` 네임스페이스 |
| `web/deployment.yaml` | 2 replicas, 256Mi/500m, ConfigMap 환경변수 |
| `web/service.yaml` | ClusterIP 서비스 |
| `web/ingress.yaml` | Traefik Ingress, `web.textile.local` |
| `api/deployment.yaml` | 2 replicas, 512Mi/500m, Secret + ConfigMap |
| `api/service.yaml` | ClusterIP 서비스 |
| `api/ingress.yaml` | Traefik Ingress, `api.textile.local` |
| `ai/deployment.yaml` | 1 replica, 1Gi/1000m, GPU 설정 주석 처리 |
| `ai/service.yaml` | ClusterIP 서비스 |
| `postgres/deployment.yaml` | Recreate 전략, exec 기반 liveness/readiness probe |
| `postgres/service.yaml` | ClusterIP 서비스 |
| `postgres/pvc.yaml` | 20Gi PersistentVolumeClaim |
| `redis/deployment.yaml` | Recreate 전략, appendonly 영속화, 패스워드 보호 |
| `redis/service.yaml` | ClusterIP 서비스 |

## 서비스 구성
| 서비스 | 포트 | replicas | 메모리 | CPU |
|--------|------|----------|--------|-----|
| web | 3000 | 2 | 256Mi | 500m |
| api | 3001 | 2 | 512Mi | 500m |
| ai | 8000 | 1 | 1Gi | 1000m |
| postgres | 5432 | 1 | - | - |
| redis | 6379 | 1 | - | - |

## Kubernetes 배포 방법
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/redis/
kubectl apply -f k8s/ai/
kubectl apply -f k8s/api/
kubectl apply -f k8s/web/
```

## 주요 설계 결정
- 모든 Deployment에 Liveness + Readiness probe 적용
- Secret (민감 정보) / ConfigMap (비민감 환경변수) 분리
- AI 서비스: GPU 노드 설정 주석 처리 (필요 시 활성화)
- 이미지 태그: `latest` 대신 커밋 SHA 사용 권장
- PostgreSQL: exec probe 방식 (`pg_isready`)
- Redis: `redis-cli ping`으로 상태 확인
