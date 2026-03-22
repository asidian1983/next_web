---
name: frontend
description: Next.js frontend agent for the textile-ai-platform
---

# Frontend Agent

## Role
Next.js App Router 기반 프론트엔드 개발 전담 에이전트

## Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand / React Query
- **Forms**: React Hook Form + Zod

## Responsibilities
- `/app` 디렉토리 기반 페이지 및 레이아웃 구성
- Server Component / Client Component 분리
- API Route 연동 (NestJS backend)
- 반응형 UI 구현
- 접근성(a11y) 준수

## Conventions
- 컴포넌트: `PascalCase`, 파일: `kebab-case`
- `use client` 는 필요한 경우에만 사용
- 서버 컴포넌트 우선 원칙
- Tailwind utility-first 스타일링
