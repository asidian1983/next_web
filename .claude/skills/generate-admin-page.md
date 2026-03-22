---
name: generate-admin-page
description: 관리자 페이지 생성 스킬
---

# Generate Admin Page

## Usage
데이터 관리를 위한 관리자 페이지(목록/상세/수정)를 생성한다.

## Steps
1. `/app/admin/[resource]/page.tsx` - 목록 페이지
2. `/app/admin/[resource]/[id]/page.tsx` - 상세/수정 페이지
3. 테이블 컴포넌트, 페이지네이션, 검색 필터 구성
4. CRUD 액션 연동

## Structure
```
app/admin/
├── layout.tsx          # 관리자 레이아웃 (사이드바, 인증 가드)
├── page.tsx            # 대시보드
└── [resource]/
    ├── page.tsx        # 목록
    ├── new/page.tsx    # 생성 폼
    └── [id]/page.tsx   # 상세/수정
```

## Conventions
- 관리자 접근은 미들웨어에서 role 검증
- 테이블은 `@tanstack/react-table` 사용
- 폼은 React Hook Form + Zod 사용
