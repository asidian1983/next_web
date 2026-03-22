# Frontend Agent — 작업 내역

## 담당 에이전트
`frontend` — Next.js App Router 기반 프론트엔드 개발

## 작업 범위
`apps/web/` 전체

## 생성된 파일 목록 (29개)

### 설정 파일
| 파일 | 설명 |
|------|------|
| `package.json` | 의존성: Next.js 14, TanStack Query v5, Zustand, React Hook Form, Zod, Axios, Lucide |
| `tsconfig.json` | TypeScript strict 설정, `@/*` 경로 alias |
| `next.config.ts` | 이미지 도메인 설정, standalone output |
| `tailwind.config.ts` | 커스텀 `textile` / `fabric` 컬러 팔레트, 애니메이션 |
| `postcss.config.js` | PostCSS 설정 |
| `.env.example` | 환경 변수 템플릿 |

### 라이브러리 & 스토어
| 파일 | 설명 |
|------|------|
| `lib/api.ts` | Axios 인스턴스, JWT Bearer 인터셉터, 401 자동 리다이렉트 |
| `lib/queryClient.ts` | TanStack Query v5 클라이언트, 스마트 retry 로직 |
| `lib/utils.ts` | `cn()`, `formatDate()`, `getStatusColor()` 유틸 함수 |
| `store/authStore.ts` | Zustand 영속 스토어, localStorage 동기화 |

### 훅
| 파일 | 설명 |
|------|------|
| `hooks/useAuth.ts` | login / register / logout mutations, 성공 시 리다이렉트 |
| `hooks/useDesigns.ts` | 디자인 목록, 단건 조회, 생성, 삭제, 작업 상태 2초 자동 폴링 |

### UI 컴포넌트
| 파일 | 설명 |
|------|------|
| `components/ui/Button.tsx` | 5가지 variant, 3가지 size, 로딩 스피너 |
| `components/ui/Input.tsx` | 라벨, 에러, 헬퍼 텍스트, 좌우 아이콘 슬롯 |
| `components/ui/Card.tsx` | Card, CardHeader, CardContent, CardFooter 등 |
| `components/ui/LoadingSpinner.tsx` | 4가지 size, 선택적 라벨 |

### 레이아웃 컴포넌트
| 파일 | 설명 |
|------|------|
| `components/layout/Header.tsx` | 로고, 인증 상태별 네비게이션, 로그아웃 |
| `components/layout/Sidebar.tsx` | 활성 상태 네비게이션 링크, 유저 아바타 이니셜 |

### 디자인 컴포넌트
| 파일 | 설명 |
|------|------|
| `components/designs/DesignCard.tsx` | 이미지 호버 오버레이, 상태 배지, 삭제 확인 |
| `components/designs/DesignGrid.tsx` | 로딩/에러/빈 상태 처리, 반응형 그리드 |
| `components/designs/GenerateForm.tsx` | 스타일 피커, 해상도 선택, 실시간 작업 폴링 프리뷰 |

### 페이지
| 파일 | 설명 |
|------|------|
| `app/layout.tsx` | 루트 레이아웃, QueryClientProvider, 글로벌 CSS |
| `app/globals.css` | 글로벌 스타일, Tailwind 디렉티브 |
| `app/page.tsx` | 랜딩 페이지: 히어로, 기능 소개, 가격 CTA, 푸터 |
| `app/login/page.tsx` | 로그인 폼 (RHF + Zod) |
| `app/register/page.tsx` | 회원가입 폼, 비밀번호 확인 검증 |
| `app/dashboard/page.tsx` | 인증 가드, 통계 카드, 디자인 갤러리 |
| `app/generate/page.tsx` | 인증 가드, 생성 폼 |
| `app/designs/[id]/page.tsx` | 디자인 상세, 다운로드, 삭제, 유사 생성 |

## 주요 설계 결정
- Server Component 기본, 인터랙션 필요 시에만 `'use client'`
- JWT는 localStorage에 저장, Zustand로 관리
- 이미지 생성 작업은 2초 간격 자동 폴링 (done/failed 시 중단)
- 텍스타일/패브릭 테마 커스텀 컬러 팔레트 적용

## 실행 방법
```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev  # http://localhost:3000
```
