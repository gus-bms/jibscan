# CLAUDE.md — jibscan 프로젝트 개발 지침

This file provides guidance to AI assistants (Claude and others) working on this repository.

---

## 📌 프로젝트 개요

**jibscan**은 국토교통부 공공 API(MOLIT)를 기반으로 한 한국 부동산 AI 분석 플랫폼입니다.
사용자가 자연어로 부동산 데이터를 조회·분석하고, 투자 인사이트를 얻을 수 있는 풀스택 웹 서비스입니다.

### 핵심 기능 (MVP)

1. **아파트 시세 분석 챗봇** — 자연어로 실거래가 조회 및 트렌드 분석
2. **내 집 마련 플래너** — 예산/지역 기반 현실적 매물 추천 (매매 vs 전세 비교)
3. **부동산 시장 모니터링** — 지역별 거래량·가격 변동 감지 및 알림
4. **경매/공매 AI 분석** — 낙찰가율, 경쟁률, 권리분석 포인트 요약
5. **청약 당첨 전략 어드바이저** — 청약 일정·경쟁률 분석 및 전략 제안

---

## 🗂️ 모노레포 구조

```
jibscan/
├── apps/
│   ├── web/                  # Next.js 15 (App Router) — 프론트엔드
│   └── api/                  # NestJS — 백엔드 API 서버
├── packages/
│   ├── mcp-client/           # real-estate-mcp 연동 클라이언트
│   ├── ui/                   # 공유 UI 컴포넌트 (shadcn/ui 기반)
│   ├── types/                # 공유 TypeScript 타입 정의
│   └── config/               # ESLint, TSConfig 등 공유 설정
├── CLAUDE.md
├── package.json              # pnpm workspace 루트
└── turbo.json                # Turborepo 설정
```

---

## 🛠️ 기술 스택

### Frontend (`apps/web`)

| 항목 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript 5.x |
| 스타일링 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui |
| 상태 관리 | Zustand + TanStack Query v5 |
| 차트 | Recharts |
| 지도 | Kakao Maps SDK |
| 폼 | React Hook Form + Zod |

### Backend (`apps/api`)

| 항목 | 기술 |
|---|---|
| 프레임워크 | NestJS 11 |
| 언어 | TypeScript 5.x |
| ORM | Prisma |
| DB | PostgreSQL 16 |
| 캐시 | Redis (ioredis) |
| 인증 | JWT (Passport.js) |
| 작업 큐 | BullMQ |
| 문서화 | Swagger (OpenAPI 3.0) |

### MCP / AI

| 항목 | 기술 |
|---|---|
| MCP 서버 | tae0y/real-estate-mcp (MOLIT API) |
| AI 모델 | Claude API (`claude-sonnet-4-6`) |
| MCP 클라이언트 | `@anthropic-ai/sdk` + MCP SDK |

### 인프라

| 항목 | 기술 |
|---|---|
| 패키지 매니저 | pnpm + Turborepo |
| 컨테이너 | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| 환경변수 | dotenv + `@nestjs/config` |

---

## 🏗️ 아키텍처 원칙

### 전체 데이터 흐름

```
사용자 (Next.js)
  ↓ REST / SSE
NestJS API
  ↓ MCP Client
real-estate-mcp (MOLIT 공공 API)
  ↓
Claude API (분석/요약/전략 생성)
  ↓
PostgreSQL (결과 캐싱, 사용자 데이터)
Redis (단기 캐시, 세션, 큐)
```

### 백엔드 모듈 구조 (NestJS)

```
src/
├── modules/
│   ├── auth/             # 인증/인가 (JWT)
│   ├── apartment/        # 아파트 시세 조회·분석
│   ├── planner/          # 내 집 마련 플래너
│   ├── monitoring/       # 시장 모니터링 & 알림
│   ├── auction/          # 경매/공매 분석
│   ├── subscription/     # 청약 분석
│   ├── chat/             # AI 챗봇 (SSE 스트리밍)
│   └── mcp/              # MCP 클라이언트 래퍼 (공통)
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/               # 환경 설정
└── prisma/               # 스키마 & 마이그레이션
```

### 프론트엔드 라우트 구조 (Next.js App Router)

```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (dashboard)/
│   ├── layout.tsx        # 공통 대시보드 레이아웃
│   ├── page.tsx          # 홈 (시장 요약 대시보드)
│   ├── chat/             # 시세 분석 챗봇
│   ├── planner/          # 내 집 마련 플래너
│   ├── monitoring/       # 시장 모니터링
│   ├── auction/          # 경매 분석
│   └── subscription/     # 청약 어드바이저
├── api/                  # Next.js Route Handlers (BFF 용도)
└── layout.tsx
```

---

## 🔌 MCP 연동 가이드

### 환경변수 설정

```bash
# .env
DATA_GO_KR_API_KEY=your_data_go_kr_api_key   # 공공데이터포털 API 키
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### MCP 클라이언트 패턴 (NestJS)

```typescript
// packages/mcp-client/src/real-estate.client.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

@Injectable()
export class RealEstateMcpClient {
  private client: Client

  async callTool(toolName: string, args: Record<string, unknown>) {
    return this.client.callTool({ name: toolName, arguments: args })
  }

  // 아파트 실거래가 조회
  async getApartmentTrades(regionCode: string, yearMonth: string) {
    return this.callTool('get_apartment_trades', { regionCode, yearMonth })
  }

  // 아파트 전월세 조회
  async getApartmentRent(regionCode: string, yearMonth: string) {
    return this.callTool('get_apartment_rent', { regionCode, yearMonth })
  }

  // 공매 데이터 조회
  async getAuctions(regionCode: string, yearMonth: string) {
    return this.callTool('get_auctions', { regionCode, yearMonth })
  }
}
```

### AI 분석 패턴 (Claude API + SSE 스트리밍)

```typescript
// chat 모듈에서 스트리밍 응답 예시
async *streamAnalysis(prompt: string): AsyncGenerator<string> {
  const stream = await this.anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
    system: JIBSCAN_SYSTEM_PROMPT,
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      yield chunk.delta.text
    }
  }
}
```

> **규칙:** MCP 툴 호출은 반드시 `mcp` 모듈을 통해서만 접근. 직접 호출 금지.

---

## 📐 코딩 컨벤션

### 공통

- **언어:** TypeScript strict 모드 필수
- **포맷터:** Prettier (탭 크기 2, 세미콜론 없음, 작은따옴표)
- **린터:** ESLint (Airbnb 기반 + NestJS 플러그인)
- **커밋:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:` 등)
- **브랜치 전략:** `main` → `develop` → `feat/기능명`

### NestJS (백엔드)

- 모든 엔드포인트에 Swagger 데코레이터 필수 (`@ApiOperation`, `@ApiResponse`)
- 비즈니스 로직은 반드시 **Service 레이어**에만 작성
- DTO는 `class-validator` + `class-transformer` 사용
- 에러는 NestJS 내장 Exception 또는 커스텀 Exception Filter 사용
- 외부 API 호출은 반드시 Redis 캐싱 적용 (공공 API TTL: 1시간)

### Next.js (프론트엔드)

- **Server Component 우선 원칙** — 클라이언트 컴포넌트는 필요할 때만
- 데이터 페칭: TanStack Query (클라이언트) / `fetch` (서버)
- 컴포넌트 파일명: `PascalCase` (`ApartmentChart.tsx`)
- 훅 파일명: `camelCase` with `use` prefix (`useApartmentData.ts`)
- 환경변수: 클라이언트 노출 변수만 `NEXT_PUBLIC_` prefix 사용

---

## 🗄️ 데이터베이스 설계 원칙

### Prisma 스키마 주요 모델

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  alerts    Alert[]
  planners  Planner[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Alert {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  regionCode String    // 법정동 코드
  regionName String
  type       AlertType // PRICE_UP | PRICE_DOWN | VOLUME_SURGE
  threshold  Float
  isActive   Boolean   @default(true)
  createdAt  DateTime  @default(now())
}

model Planner {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  budget      Int
  regions     String[] // 법정동 코드 배열
  housingType String   // BUY | RENT | JEONSE
  result      Json?    // AI 분석 결과 캐싱
  createdAt   DateTime @default(now())
}

enum AlertType {
  PRICE_UP
  PRICE_DOWN
  VOLUME_SURGE
}
```

### 캐싱 전략 (Redis)

| 데이터 | TTL | 키 패턴 |
|---|---|---|
| 실거래가 조회 | 1시간 | `trades:{regionCode}:{yearMonth}` |
| 전월세 조회 | 1시간 | `rent:{regionCode}:{yearMonth}` |
| 경매 데이터 | 1시간 | `auction:{regionCode}:{yearMonth}` |
| 청약 정보 | 6시간 | `subscription:{yearMonth}` |
| AI 분석 결과 | 24시간 | `analysis:{hash(prompt)}` |

---

## 🔐 보안 원칙

- **API 키는 절대 클라이언트에 노출 금지** — 모든 외부 API 호출은 NestJS 서버에서만
- JWT Access Token: 15분, Refresh Token: 7일
- `DATA_GO_KR_API_KEY`는 서버 환경변수로만 관리
- Rate Limiting: NestJS `ThrottlerModule` 적용 (기본: 100 req/min/IP)
- CORS: 허용 도메인 명시적 설정 (와일드카드 금지)
- 입력값 검증: 모든 API 입력에 `class-validator` 적용

---

## 🚀 개발 환경 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Python 3.11+ (real-estate-mcp 실행용)
- uv (Python 패키지 매니저)

### 초기 설정

```bash
# 1. 레포 클론
git clone https://github.com/your-org/jibscan.git
cd jibscan

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일에 API 키 입력

# 4. DB 및 Redis 실행
docker-compose up -d postgres redis

# 5. DB 마이그레이션
pnpm --filter api prisma migrate dev

# 6. real-estate-mcp 서버 설정 (별도 터미널)
cd mcp-server/real-estate-mcp
uv run python src/real_estate/mcp_server/server.py

# 7. 개발 서버 실행
pnpm dev
```

### 주요 스크립트

```bash
pnpm dev          # 전체 개발 서버 (turbo)
pnpm build        # 전체 빌드
pnpm test         # 전체 테스트
pnpm lint         # 전체 린트
pnpm type-check   # TypeScript 타입 검사
```

---

## 🧪 테스트 전략

- **Unit Test:** NestJS Service 레이어 (Jest)
- **Integration Test:** API 엔드포인트 (supertest)
- **E2E Test:** 주요 사용자 플로우 (Playwright)
- **커버리지 목표:** 백엔드 70% 이상

---

## 📋 기능별 개발 우선순위

### Phase 1 — MVP (4주)

- [ ] 모노레포 기반 설정 (Turborepo + pnpm)
- [ ] NestJS 기본 구조 + Prisma + Redis 연동
- [ ] real-estate-mcp 클라이언트 모듈 구현
- [ ] 아파트 시세 조회 API
- [ ] AI 챗봇 (SSE 스트리밍) — 시세 분석
- [ ] Next.js 기본 레이아웃 + 챗봇 UI

### Phase 2 — 핵심 기능 (4주)

- [ ] 내 집 마련 플래너 (매매 vs 전세 비교)
- [ ] 경매/공매 AI 분석
- [ ] 청약 어드바이저
- [ ] 사용자 인증 (JWT)
- [ ] Kakao Maps 지도 연동

### Phase 3 — 고도화 (4주)

- [ ] 시장 모니터링 + 알림 시스템 (BullMQ + 이메일)
- [ ] 분석 리포트 저장 및 히스토리
- [ ] 대시보드 고도화 (차트, 지표)
- [ ] 성능 최적화 및 캐싱 전략 강화

---

## 🤖 AI 어시스턴트 가이드라인

이 코드베이스에서 작업할 때:

1. **읽고 나서 수정** — 파일을 수정하기 전에 반드시 먼저 읽어 컨텍스트와 컨벤션을 파악
2. **최소 변경** — 요청된 작업에 필요한 변경만 수행, 관련 없는 코드 리팩토링 금지
3. **스타일 일치** — 기존 코드 스타일, 네이밍 컨벤션, 패턴을 따를 것
4. **테스트 커버리지** — 추가하거나 수정한 코드에 대한 테스트 추가 또는 업데이트
5. **브랜치 규율** — 모든 작업은 지정된 feature 브랜치에서 진행, 리뷰 없이 `main`에 직접 push 금지
6. **MCP 접근 규칙** — 공공 API 데이터는 반드시 `mcp` 모듈을 통해서만 접근
7. **보안 우선** — API 키와 민감 정보는 절대 클라이언트 코드나 git에 노출 금지
8. **이 파일 업데이트** — 새로운 컨벤션, 명령어, 아키텍처 결정이 생기면 이 CLAUDE.md를 업데이트

---

## 📝 참고 자료

- [real-estate-mcp GitHub](https://github.com/tae0y/real-estate-mcp) — MOLIT MCP 서버
- [공공데이터포털](https://www.data.go.kr) — API 키 발급
- [NestJS 공식 문서](https://docs.nestjs.com)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Anthropic MCP 문서](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [Claude API 문서](https://docs.anthropic.com/en/api)
