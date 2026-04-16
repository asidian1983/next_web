# Frontend Tools — apps/web

## 프레임워크

| 툴 | 버전 | 용도 |
|----|------|------|
| [Next.js](https://nextjs.org) | 14.2.5 | React 풀스택 프레임워크, App Router, standalone 빌드 |
| [React](https://react.dev) | 18.3 | UI 라이브러리 |
| [TypeScript](https://typescriptlang.org) | 5.x | 타입 안전성 |

## 스타일링

| 툴 | 버전 | 용도 |
|----|------|------|
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | 유틸리티 CSS — 커스텀 토큰 `fabric-*`, `textile-*` |
| [clsx](https://github.com/lukeed/clsx) | 2.1 | 조건부 클래스 조합 |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.4 | Tailwind 클래스 충돌 해결 |
| [Lucide React](https://lucide.dev) | 0.414 | 아이콘 라이브러리 |

**Glass morphism 표준 클래스:**
```
bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl
```

**Ambient glow 표준 클래스:**
```
bg-fabric-600/10 rounded-full blur-[120px]
```

## 상태관리 & 데이터 페칭

| 툴 | 버전 | 용도 |
|----|------|------|
| [Zustand](https://zustand-demo.pmnd.rs) | 4.5 | 글로벌 상태 — `store/authStore` |
| [TanStack Query](https://tanstack.com/query) | 5.51 | 서버 상태, 캐싱, 비동기 요청 |
| [Axios](https://axios-http.com) | 1.7 | HTTP 클라이언트 |

## 폼 & 유효성 검사

| 툴 | 버전 | 용도 |
|----|------|------|
| [React Hook Form](https://react-hook-form.com) | 7.52 | 폼 상태 관리 |
| [Zod](https://zod.dev) | 3.23 | 스키마 기반 유효성 검사 |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 3.9 | RHF ↔ Zod 연결 |

## 개발 도구

| 툴 | 용도 |
|----|------|
| ESLint + eslint-config-next | Next.js 린트 규칙 |
| PostCSS | Tailwind CSS 처리 |
| `npx tsc --noEmit` | 타입 체크 |
| `npm run analyze` | 번들 분석 (`ANALYZE=true`) |

## 주요 명령어

```bash
cd apps/web
npm run dev        # 개발 서버 (포트 3000)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
npm run type-check # TypeScript 타입 체크
npm run analyze    # 번들 사이즈 분석
```
