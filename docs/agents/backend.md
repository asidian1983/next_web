# Backend Agent — 작업 내역

## 담당 에이전트
`backend` — NestJS 기반 REST API 서버 개발

## 작업 범위
`apps/api/` 전체

## 생성된 파일 목록 (25개)

### 설정 파일
| 파일 | 설명 |
|------|------|
| `package.json` | NestJS, Prisma, JWT, bcrypt, axios, class-validator 의존성 |
| `tsconfig.json` / `tsconfig.build.json` | TypeScript 설정, 데코레이터 지원 |
| `nest-cli.json` | NestJS CLI 설정 |
| `.env.example` | DATABASE_URL, JWT_SECRET, JWT_EXPIRATION, FASTAPI_URL, PORT |
| `prisma/schema.prisma` | User + Design 모델, Role/DesignStatus enum |

### 소스 파일

#### 앱 진입점
| 파일 | 설명 |
|------|------|
| `src/main.ts` | Bootstrap, CORS(localhost:3000), global ValidationPipe |
| `src/app.module.ts` | ConfigModule, PrismaModule, AuthModule, DesignsModule, AiModule |

#### Prisma
| 파일 | 설명 |
|------|------|
| `src/prisma/prisma.service.ts` | PrismaClient + 생명주기 훅 |
| `src/prisma/prisma.module.ts` | @Global() 모듈 |

#### Auth
| 파일 | 설명 |
|------|------|
| `src/auth/dto/register.dto.ts` | @IsEmail, @MinLength(8) 패스워드, @MinLength(2) 이름 |
| `src/auth/dto/login.dto.ts` | @IsEmail, @IsString 패스워드 |
| `src/auth/jwt.strategy.ts` | PassportStrategy, DB에서 유저 존재 검증 |
| `src/auth/jwt-auth.guard.ts` | AuthGuard('jwt') |
| `src/auth/auth.service.ts` | register(bcrypt 해시, 중복 체크) + login(비교, JWT 발급) |
| `src/auth/auth.controller.ts` | POST /auth/register, POST /auth/login |
| `src/auth/auth.module.ts` | JwtModule.registerAsync (ConfigService 사용) |

#### AI 통신
| 파일 | 설명 |
|------|------|
| `src/ai/ai.service.ts` | axios 클라이언트, submitGenerationJob() + getJobStatus() |
| `src/ai/ai.module.ts` | AiModule 등록 |

#### Designs
| 파일 | 설명 |
|------|------|
| `src/designs/dto/generate-design.dto.ts` | prompt, style, width(256-1024), height(256-1024) |
| `src/designs/dto/design-response.dto.ts` | 응답 DTO |
| `src/designs/designs.service.ts` | listDesigns(페이지네이션), generateDesign, getDesign, deleteDesign, getJobStatus |
| `src/designs/designs.controller.ts` | @UseGuards(JwtAuthGuard) 전체 적용 |
| `src/designs/designs.module.ts` | DesignsModule 등록 |

## API 엔드포인트
| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /auth/register | 회원가입 | ❌ |
| POST | /auth/login | 로그인, JWT 반환 | ❌ |
| GET | /designs | 내 디자인 목록 (페이지네이션) | ✅ |
| POST | /designs/generate | 생성 작업 제출 | ✅ |
| GET | /designs/job/:jobId | 작업 상태 폴링 | ✅ |
| GET | /designs/:id | 디자인 상세 조회 | ✅ |
| DELETE | /designs/:id | 디자인 삭제 | ✅ |

## Prisma 모델
- `User`: id, email(unique), password(bcrypt), name, role(USER/ADMIN)
- `Design`: id, prompt, style, imageUrl, status(PENDING/PROCESSING/DONE/FAILED), jobId, width, height

## 주요 설계 결정
- `PrismaModule`을 `@Global()`로 설정해 어디서든 PrismaService 주입 가능
- `GET /designs/job/:jobId`를 `GET /designs/:id` 앞에 정의 (라우터 우선순위)
- 디자인 먼저 DB에 PENDING 상태로 생성 후 FastAPI 호출, 실패 시 FAILED 처리
- 모든 응답은 `{ data, message }` 형식으로 일관성 유지

## 실행 방법
```bash
cd apps/api
cp .env.example .env  # DATABASE_URL, JWT_SECRET 설정
npm install
npx prisma migrate dev
npm run start:dev  # http://localhost:3001
```
