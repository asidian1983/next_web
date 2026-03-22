---
name: create-service
description: 새로운 마이크로서비스 생성 워크플로우
---

# Create Service Workflow

## Overview
새로운 마이크로서비스(NestJS 모듈 또는 FastAPI 서비스)를 프로젝트에 추가하는 워크플로우

## Steps

### 1. 서비스 정의
- 서비스 목적 및 책임 범위 정의
- 다른 서비스와의 인터페이스 설계

### 2. 프로젝트 구조 생성
```
services/[service-name]/
├── src/
├── Dockerfile
├── package.json (NestJS) or pyproject.toml (FastAPI)
└── README.md
```

### 3. Docker 설정
- `Dockerfile` 작성
- `docker-compose.yml`에 서비스 추가

### 4. k3s 매니페스트
- `k8s/[service-name]/deployment.yaml`
- `k8s/[service-name]/service.yaml`
- `k8s/[service-name]/ingress.yaml` (외부 노출 시)

### 5. 환경 변수
- `.env.example` 업데이트
- k3s Secret / ConfigMap 추가

## Agents
- planner → backend 또는 ai → infra
