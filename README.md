# 🔔 링톡 (RingTalk)

카카오톡을 겨냥한 메신저 앱 — **모바일(iOS/Android) + PC(Windows/macOS)** 지원

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 모바일 | React Native (Expo) |
| 데스크톱 | Tauri 2 + React |
| 서버 | NestJS (TypeScript) |
| 실시간 | Socket.IO |
| DB | PostgreSQL + Prisma ORM |
| 캐시/세션 | Redis (ioredis) |
| 인증 | 전화번호 OTP + JWT |
| 모노레포 | pnpm workspaces + Turborepo |

---

## 디렉토리 구조

```
ringtalk/
├── apps/
│   ├── mobile/       # React Native (Expo) — iOS / Android
│   ├── desktop/      # Tauri + React — Windows / macOS
│   └── server/       # NestJS API 서버
├── packages/
│   └── shared/       # 공통 타입, 상수, 유틸
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 빠른 시작

### 1. 사전 요구사항

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- Docker & Docker Compose (PostgreSQL + Redis)
- Rust + Tauri CLI (데스크톱 앱용)

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 인프라 실행 (DB + Redis)

```bash
docker-compose up -d
```

### 4. 서버 환경변수 설정

```bash
cp apps/server/.env.example apps/server/.env
# .env 파일을 열어 JWT_SECRET 등 필수 값 수정
```

### 5. DB 마이그레이션 + 시드

```bash
cd apps/server
pnpm db:generate   # Prisma 클라이언트 생성
pnpm db:migrate    # DB 마이그레이션
pnpm db:seed       # 테스트 데이터 삽입
```

### 6. 개발 서버 실행

```bash
# 서버만
pnpm server

# 모바일 (Expo Go 필요)
pnpm mobile

# 데스크톱 (Rust/Tauri 필요)
cd apps/desktop && pnpm tauri:dev
```

---

## Auth API

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/v1/auth/request-otp` | OTP 발송 요청 |
| POST | `/api/v1/auth/verify-otp` | OTP 검증 + 로그인 |
| POST | `/api/v1/auth/refresh` | 액세스 토큰 갱신 |
| POST | `/api/v1/auth/logout` | 로그아웃 (🔒 인증 필요) |
| GET | `/api/v1/auth/sessions` | 로그인 기기 목록 (🔒) |
| DELETE | `/api/v1/auth/sessions/:id` | 특정 기기 강제 로그아웃 (🔒) |

---

## 디자인 토큰 (퍼플 테마)

```
Primary:     #b350cc / #bd66d2 / #9a3db0
Background:  #f6e9f9 / #ecd3f2
Text:        #1a0a1e (primary) / #6b5572 (secondary)
Bubble Mine: #b350cc (text: white)
Bubble Other: white (text: #1a0a1e)
```

---

## 개발 체크리스트 (1주차)

- [x] 모노레포 구조 (pnpm + turborepo)
- [x] `packages/shared` — 공통 타입/상수/유틸
- [x] NestJS 서버 골격
- [x] Auth API (OTP 요청/검증/갱신/로그아웃)
- [x] Rate Limit (전화번호 + IP)
- [x] 디바이스별 세션 관리
- [x] Prisma 스키마 + Docker Compose
- [x] React Native(Expo) 로그인 화면 (Welcome → Phone → OTP → ProfileSetup)
- [x] Tauri 데스크톱 로그인 화면
- [x] 퍼플 디자인 토큰 시스템
- [ ] OTP Mock → Twilio 실제 연동 (2주차)
- [ ] WebSocket 실시간 채팅 (2주차)
- [ ] 푸시 알림 FCM/APNs (3주차)
