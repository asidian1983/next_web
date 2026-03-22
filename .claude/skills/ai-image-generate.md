---
name: ai-image-generate
description: 텍스타일 AI 이미지 생성 기능 구현 스킬
---

# AI Image Generate

## Usage
FastAPI AI 서비스를 통한 텍스타일 이미지 생성 기능을 구현한다.

## Flow
```
사용자 요청 → Next.js → NestJS API → FastAPI AI → 이미지 생성 → S3 저장 → URL 반환
```

## Steps
1. FastAPI 엔드포인트 구현 (`POST /generate`)
2. NestJS에서 FastAPI 호출 서비스 작성
3. 작업 상태 폴링 또는 WebSocket 구성
4. Next.js UI에서 생성 요청 및 결과 표시

## API Contract
```typescript
// Request
interface GenerateRequest {
  prompt: string
  style?: string
  width?: number
  height?: number
}

// Response
interface GenerateResponse {
  jobId: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  imageUrl?: string
}
```
