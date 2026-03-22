---
name: deploy-service
description: k3s 배포 워크플로우
---

# Deploy Service Workflow

## Overview
서비스를 k3s 클러스터에 빌드하고 배포하는 워크플로우

## Steps

### 1. 빌드
```bash
docker build -t registry/[service]:[tag] .
docker push registry/[service]:[tag]
```

### 2. 매니페스트 업데이트
- `k8s/[service]/deployment.yaml`의 이미지 태그 변경

### 3. 배포
```bash
kubectl apply -f k8s/[service]/
kubectl rollout status deployment/[service]
```

### 4. 확인
```bash
kubectl get pods -n [namespace]
kubectl logs -f deployment/[service]
```

## Rollback
```bash
kubectl rollout undo deployment/[service]
```

## Environments
| 환경 | 네임스페이스 | 트리거 |
|------|------------|--------|
| dev | development | push to `dev` branch |
| staging | staging | push to `main` branch |
| prod | production | manual approval |

## Agents
- infra
