# Agent Work Log

## Session: 2026-03-22 — HeroSection Spline 3D Integration

---

### Agent 1: `frontend` — Spline iframe 삽입

**Branch:** `feat/spline-hero-iframe`

**작업 내역:**
- `HeroSection.tsx`의 우측 패널(디자인 카드 그리드)을 Spline 3D iframe으로 교체
- 기존 `DESIGN_CARDS` 상수 및 관련 JSX 제거
- `<iframe src="https://my.spline.design/boxeshover-owt6mJfKfrEtuxEuXtS0K5VC/" />` 삽입
- deprecated `frameBorder` 속성 제거
- 불필요한 `DESIGN_CARDS` 배열 삭제로 코드 정리

**변경 파일:**
- `apps/web/components/demo/HeroSection.tsx`

---

### Agent 2: `frontend:style` — Spline iframe CSS 조정

**Branch:** `style/spline-hero-css`

**작업 내역:**
- Spline 씬 배경(어두운 계열)에 어울리도록 컨테이너 CSS 조정
- 씬 뒤에 ambient glow(보라/패브릭/텍스타일 컬러) 블러 레이어 추가
- iframe 높이를 115%로 설정하고 약간 위로 올려 Spline 워터마크 크롭
- 하단 `from-gray-950` 그라디언트 오버레이로 워터마크 완전 차단
- solid border 제거 → `ring-1 ring-white/10` 글로우 링으로 교체
- 컨테이너 높이 500px → 520px 조정

**변경 파일:**
- `apps/web/components/demo/HeroSection.tsx`
