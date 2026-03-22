---
name: build-feature
description: 새로운 기능 전체 개발 워크플로우
---

# Build Feature Workflow

## Overview
요구사항부터 배포까지 새로운 기능을 개발하는 표준 워크플로우

## Steps

### 1. 설계 (Planner)
- 요구사항 명확화
- 영향 범위 분석
- API 계약 정의

### 2. DB (Backend)
- Prisma 스키마 모델 추가
- `prisma migrate dev` 실행

### 3. API (Backend)
- NestJS Module / Controller / Service / DTO 생성
- 유효성 검사 및 에러 핸들링

### 4. AI 연동 (AI) — 필요 시
- FastAPI 엔드포인트 구현
- NestJS ↔ FastAPI 통신 서비스 작성

### 5. UI (Frontend)
- React Query 훅 작성
- 페이지 및 컴포넌트 구현

### 6. 검증
- 기능 동작 확인
- 타입 에러 없음 확인 (`tsc --noEmit`)

## Agents
- planner → backend → ai (선택) → frontend
