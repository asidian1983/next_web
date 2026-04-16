# AI Service Tools — apps/ai

## 프레임워크

| 툴 | 버전 | 용도 |
|----|------|------|
| [FastAPI](https://fastapi.tiangolo.com) | 0.115.5 | Python 비동기 API 프레임워크 |
| [Uvicorn](https://www.uvicorn.org) | 0.32.1 | ASGI 서버 (`[standard]` — websocket, http2 포함) |
| [Pydantic](https://docs.pydantic.dev) | 2.10.3 | 데이터 유효성 검사, 스키마 정의 (`models/schemas.py`) |

## 이미지 처리

| 툴 | 버전 | 용도 |
|----|------|------|
| [Pillow](https://python-pillow.org) | 11.0 | 이미지 생성/편집/변환 |

## 외부 API 연동

| 툴 | 버전 | 용도 |
|----|------|------|
| [httpx](https://www.python-httpx.org) | 0.28.1 | 비동기 HTTP 클라이언트 (OpenAI, HuggingFace 요청) |
| OpenAI API | — | 텍스타일 이미지 생성 (`OPENAI_API_KEY`) |
| HuggingFace | — | 모델 허브 (`HF_TOKEN`) |

## 환경 설정

| 툴 | 버전 | 용도 |
|----|------|------|
| [python-dotenv](https://saurabh-kumar.com/python-dotenv) | 1.0.1 | `.env` 파일 로딩 |
| [python-multipart](https://andrew-d.github.io/python-multipart) | 0.0.20 | 파일 업로드 파싱 |

## 라우터 구조

```
routers/
├── generate.py    # POST /generate — 이미지 생성
├── analyze.py     # POST /analyze — 이미지 분석
└── health.py      # GET  /health  — 헬스체크

services/
├── generator.py       # 이미지 생성 로직
├── analyzer.py        # 이미지 분석 로직
├── prompt_enhancer.py # 프롬프트 강화
└── job_store.py       # 비동기 작업 상태 관리
```

## 환경변수

```bash
OPENAI_API_KEY=sk-...
HF_TOKEN=hf_...
REDIS_URL=redis://:redis@redis:6379
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/textile_ai
PORT=8000
```

## 주요 명령어

```bash
cd apps/ai

# 로컬 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 의존성 설치
pip install -r requirements.txt

# 문법 검사
python -m py_compile main.py routers/*.py services/*.py models/*.py
```
