# Dev Tools — 개발 환경

## 터미널 & 세션

| 툴 | 용도 |
|----|------|
| [tmux](https://github.com/tmux/tmux) | 터미널 멀티플렉서 — 4-pane 개발 환경 |
| [TPM](https://github.com/tmux-plugins/tpm) | tmux 플러그인 매니저 |
| [catppuccin/tmux](https://github.com/catppuccin/tmux) | tmux UI 테마 |
| [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) | 세션 저장/복원 |
| [tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) | 세션 자동 저장 |

**개발 환경 실행:**
```bash
./tmux.sh   # 4개 pane 자동 분할 후 전체 서비스 실행
```

| Pane | 서비스 | 명령어 |
|------|--------|--------|
| 좌측 | frontend | `cd apps/web && npm run dev` |
| 우상단 | backend | `docker compose up api` |
| 우중단 | ai | `docker compose up ai` |
| 우하단 | infra | `docker compose up postgres redis` |

**tmux prefix:** `Ctrl+a` (기본 `Ctrl+b`에서 변경)

## CI/CD

| 툴 | 용도 |
|----|------|
| [GitHub Actions](https://github.com/features/actions) | CI/CD 파이프라인 |
| `ci.yml` | PR 검증 — 타입체크, 빌드, Docker 빌드 테스트 |
| `deploy.yml` | main 머지 시 자동 배포 — Docker push → k8s rollout |

**필요한 GitHub Secrets:**
```
REGISTRY_URL        컨테이너 레지스트리 주소
REGISTRY_USERNAME   레지스트리 로그인
REGISTRY_PASSWORD   레지스트리 비밀번호
KUBECONFIG          base64 인코딩된 kubeconfig
```

## 린트 & 포맷

| 툴 | 적용 대상 | 설정 |
|----|----------|------|
| [ESLint](https://eslint.org) | web, api | eslint-config-next, @typescript-eslint |
| [Prettier](https://prettier.io) | api | eslint-plugin-prettier 통합 |
| TypeScript `tsc --noEmit` | web, api | 타입 체크 (빌드 없이) |

## 테스트

| 툴 | 적용 대상 | 명령어 |
|----|----------|--------|
| [Jest](https://jestjs.io) + ts-jest | api | `npm run test` |
| Jest coverage | api | `npm run test:cov` |
| Jest e2e | api | `npm run test:e2e` |

## 빌드 & 자동화

| 툴 | 용도 |
|----|------|
| [Make](https://www.gnu.org/software/make) | `Makefile` — dev/build/deploy/health/rollback 단축 명령어 |
| [NestJS CLI](https://docs.nestjs.com/cli/overview) | `nest build`, `nest generate` |
| [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli) | 마이그레이션, 클라이언트 생성 |

## 런타임 요구사항

| 툴 | 최소 버전 |
|----|----------|
| Node.js | 20.0.0 |
| npm | 10.0.0 |
| Python | 3.11 |
| Docker | 24.x |

## 유용한 루트 명령어

```bash
npm run install:all   # 모든 앱 의존성 한번에 설치
npm run lint          # web + api 전체 린트
npm run type-check    # web TypeScript 타입 체크
npm run db:migrate    # Prisma 마이그레이션
npm run db:studio     # Prisma Studio 실행
make health           # 전체 서비스 헬스체크
```
