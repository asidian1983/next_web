---
name: ai
description: FastAPI AI service agent for the textile-ai-platform
---

# AI Agent

## Role
FastAPI 기반 AI 추론 서비스 개발 전담 에이전트

## Stack
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ML**: PyTorch / HuggingFace / Diffusers
- **Task Queue**: Celery + Redis
- **Storage**: S3-compatible (MinIO)

## Responsibilities
- 텍스타일 이미지 생성 API 구현
- 모델 추론 엔드포인트 관리
- 비동기 작업 큐 처리
- 생성된 이미지 저장 및 URL 반환
- NestJS 백엔드와의 내부 API 통신

## Conventions
- Pydantic v2 스키마 사용
- 비동기(`async/await`) 우선 처리
- 모델 로딩은 startup 이벤트에서 한 번만
- `/health`, `/ready` 엔드포인트 필수 구현
