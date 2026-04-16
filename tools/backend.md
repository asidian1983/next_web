# Backend Tools — apps/api

## 프레임워크

| 툴 | 버전 | 용도 |
|----|------|------|
| [NestJS](https://nestjs.com) | 10.x | Node.js 서버 프레임워크, 모듈 패턴 |
| [TypeScript](https://typescriptlang.org) | 5.1 | 타입 안전성 |
| [ts-node](https://typestrong.org/ts-node) | 10.9 | TS 직접 실행 |

## ORM & 데이터베이스

| 툴 | 버전 | 용도 |
|----|------|------|
| [Prisma](https://www.prisma.io) | 5.x | ORM, 스키마 관리, 마이그레이션 |
| [@prisma/client](https://www.prisma.io/client) | 5.x | 자동 생성 타입 안전 DB 클라이언트 |

```bash
npm run prisma:migrate  # 마이그레이션 실행
npm run prisma:generate # 클라이언트 재생성
npm run prisma:studio   # Prisma Studio GUI (포트 5555)
```

## 인증 & 보안

| 툴 | 버전 | 용도 |
|----|------|------|
| [@nestjs/jwt](https://github.com/nestjs/jwt) | 10.x | JWT 토큰 발급/검증 |
| [@nestjs/passport](https://github.com/nestjs/passport) | 10.x | 인증 미들웨어 |
| [passport-jwt](https://github.com/mikenicholson/passport-jwt) | 4.x | JWT 전략 |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 5.1 | 비밀번호 해싱 |
| [helmet](https://helmetjs.github.io) | 7.x | HTTP 보안 헤더 |
| [@nestjs/throttler](https://github.com/nestjs/throttler) | 5.x | Rate limiting |

## 유효성 검사 & 직렬화

| 툴 | 버전 | 용도 |
|----|------|------|
| [class-validator](https://github.com/typestack/class-validator) | 0.14 | DTO 데코레이터 기반 유효성 검사 |
| [class-transformer](https://github.com/typestack/class-transformer) | 0.5 | 객체 직렬화/역직렬화 |

## 파일 업로드 & 유틸리티

| 툴 | 버전 | 용도 |
|----|------|------|
| [multer](https://github.com/expressjs/multer) | 1.4 | 파일 업로드 처리 |
| [compression](https://github.com/expressjs/compression) | 1.7 | HTTP 응답 압축 |
| [axios](https://axios-http.com) | 1.6 | AI 서비스 내부 통신 |
| [rxjs](https://rxjs.dev) | 7.8 | NestJS 비동기 처리 |

## 모듈 구조

```
src/
├── auth/          # 로그인, JWT, Guard
├── designs/       # 디자인 CRUD
├── collections/   # 컬렉션 관리
├── ai/            # AI 서비스 프록시
└── health/        # 헬스체크 엔드포인트
```

## 테스트

| 툴 | 버전 | 용도 |
|----|------|------|
| [Jest](https://jestjs.io) | 29.x | 테스트 프레임워크 |
| [ts-jest](https://kulshekhar.github.io/ts-jest) | 29.x | TypeScript Jest 변환 |
| [@nestjs/testing](https://docs.nestjs.com/fundamentals/testing) | 10.x | NestJS 테스트 유틸 |

## 주요 명령어

```bash
cd apps/api
npm run start:dev   # 개발 서버 watch 모드 (포트 3001)
npm run build       # 프로덕션 빌드
npm run test        # 유닛 테스트
npm run test:cov    # 커버리지 포함 테스트
npm run lint        # ESLint 자동 수정
npm run format      # Prettier 포맷
```
