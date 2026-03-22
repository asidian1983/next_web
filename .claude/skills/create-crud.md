---
name: create-crud
description: 전체 스택 CRUD 기능 생성 스킬
---

# Create CRUD

## Usage
DB 모델부터 UI까지 전체 스택 CRUD 기능을 한 번에 생성한다.

## Steps
1. **DB**: Prisma 모델 정의 + 마이그레이션
2. **Backend**: NestJS Module / Controller / Service / DTO
3. **Frontend**: React Query 훅 + 페이지 + 폼 컴포넌트

## Checklist
- [ ] Prisma 스키마 모델 추가
- [ ] NestJS CRUD 엔드포인트 (GET list, GET one, POST, PATCH, DELETE)
- [ ] DTO 유효성 검사
- [ ] React Query hooks (useQuery + useMutation)
- [ ] 목록 페이지 (테이블 + 페이지네이션)
- [ ] 생성/수정 폼 (React Hook Form + Zod)
- [ ] 삭제 확인 다이얼로그

## API Endpoints
```
GET    /api/[resource]       목록 조회
GET    /api/[resource]/:id   단건 조회
POST   /api/[resource]       생성
PATCH  /api/[resource]/:id   수정
DELETE /api/[resource]/:id   삭제
```
