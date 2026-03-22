# AI Agent — 작업 내역

## 담당 에이전트
`ai` — FastAPI 기반 AI 추론 서비스 개발

## 작업 범위
`apps/ai/` 전체

## 생성된 파일 목록 (10개)

| 파일 | 설명 |
|------|------|
| `main.py` | FastAPI 앱 진입점, CORS 설정, static 파일 마운트, 라우터 등록 |
| `models/schemas.py` | Pydantic v2 모델: GenerateRequest, GenerateResponse, JobStatus |
| `services/job_store.py` | 인메모리 딕셔너리 기반 작업 저장소 |
| `services/generator.py` | Mock 이미지 생성기 (Pillow 기반) |
| `routers/generate.py` | POST /generate, GET /jobs/{job_id} |
| `routers/health.py` | GET /health, GET /ready |
| `requirements.txt` | 고정 버전 의존성 |
| `.env.example` | CORS_ORIGINS, HOST, PORT |
| `Dockerfile` | 멀티스테이지 빌드, non-root 사용자 |
| `static/generated/.gitkeep` | 생성 이미지 저장 디렉토리 |

## API 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /generate | 생성 작업 제출, jobId 반환 |
| GET | /jobs/{job_id} | 작업 상태 폴링 |
| GET | /health | 헬스체크 |
| GET | /ready | 준비 상태 확인 |
| GET | /static/generated/{file} | 생성된 이미지 제공 |

## Mock 이미지 생성기 (generator.py)
실제 ML 모델 없이 Pillow로 텍스타일 이미지를 시뮬레이션:
- 스타일별 파스텔 팔레트 (floral, geometric, abstract, minimal, realistic 등)
- 격자/대각선 패턴으로 패브릭 질감 표현
- 중앙에 프롬프트 텍스트 렌더링 (그림자 효과)
- "Textile AI" 워터마크
- `asyncio.sleep(2~3초)` 지연으로 실제 생성 시뮬레이션
- Pillow 렌더링은 `run_in_executor`로 스레드풀 오프로드

## 작업 흐름
```
POST /generate
  → 작업 생성 (status: pending)
  → BackgroundTask로 이미지 생성 시작
  → jobId 즉시 반환 (202 Accepted)

GET /jobs/{job_id}  (2초마다 폴링)
  → status: pending → processing → done
  → done 시 image_url 반환
```

## 주요 설계 결정
- Celery 대신 FastAPI BackgroundTasks + asyncio (단순성 우선)
- 작업 저장소는 인메모리 딕셔너리 (Redis 확장 용이)
- 시스템 폰트 없을 경우 기본 비트맵 폰트 폴백 (Docker/Linux 호환)
- CORS: localhost:3000, localhost:3001 허용

## 실행 방법
```bash
cd apps/ai
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
