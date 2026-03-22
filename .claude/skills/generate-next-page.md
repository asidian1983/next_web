---
name: generate-next-page
description: Next.js App Router 페이지 생성 스킬
---

# Generate Next Page

## Usage
새로운 Next.js 페이지를 App Router 구조에 맞게 생성한다.

## Steps
1. `/app/[route]/page.tsx` 생성
2. 필요 시 `layout.tsx`, `loading.tsx`, `error.tsx` 추가
3. Server Component로 기본 구성, 인터랙션 필요 시 Client Component 분리
4. 메타데이터(`generateMetadata`) 설정

## Template
```tsx
// app/[route]/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
}

export default async function PageName() {
  return (
    <main>
      <h1>Page Title</h1>
    </main>
  )
}
```
