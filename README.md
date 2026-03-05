<div align="center">
  <img src="./assets/logo.png" alt="링톡 로고" width="160" />
  <h1>🔔 링톡 (RingTalk)</h1>
  <p><strong>마음이 '링'하는 순간, 링톡</strong></p>
  <p>카카오톡을 겨냥한 메신저 앱 — <strong>모바일(iOS/Android) + PC(Windows/macOS)</strong> 지원</p>
</div>

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 앱 (모바일 + PC) | Flutter (Dart) — iOS / Android / Windows / macOS |
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
│   ├── app/          # Flutter — iOS / Android / Windows / macOS
│   │   ├── lib/
│   │   │   ├── core/         (theme, router, network, storage)
│   │   │   ├── features/     (auth, chat, friends, settings)
│   │   │   └── shared/       (공통 위젯)
│   │   └── pubspec.yaml
│   └── server/       # NestJS API 서버
├── packages/
│   └── shared/       # 공통 타입, 상수, 유틸 (서버 전용 TypeScript)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 빠른 시작

### 1. 사전 요구사항

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- Flutter SDK >= 3.0 ([flutter.dev](https://flutter.dev/docs/get-started/install))
- Docker & Docker Compose (PostgreSQL + Redis)

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
# NestJS 서버
pnpm server

# Flutter 앱 (시뮬레이터/디바이스 연결 후)
cd apps/app
flutter pub get
flutter run

# Flutter 특정 플랫폼 지정
flutter run -d ios
flutter run -d android
flutter run -d macos
flutter run -d windows
```

---

## Auth API

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/v1/auth/request-otp` | OTP 발송 요청 |
| POST | `/api/v1/auth/verify-otp` | OTP 검증 + 로그인 |
| POST | `/api/v1/auth/refresh` | 액세스 토큰 갱신 |
| POST | `/api/v1/auth/logout` | 로그아웃 🔒 |
| GET | `/api/v1/auth/sessions` | 로그인 기기 목록 🔒 |
| DELETE | `/api/v1/auth/sessions/:id` | 특정 기기 강제 로그아웃 🔒 |

---

## 디자인 토큰 (퍼플 테마)

```
Primary:       #b350cc / #bd66d2 / #9a3db0
Background:    #f6e9f9 / #ecd3f2
Text Primary:  #1a0a1e
Text Secondary:#6b5572
Bubble Mine:   #b350cc  (글자: white)
Bubble Other:  #ffffff  (글자: #1a0a1e)
Error:         #e53935
Success:       #43a047
```

---

## 주차별 개발 로드맵

### 1주차: 아키텍처/기반 공사 + 인증 골격 ✅

**목표**
- 전체 기술 스택/리포 구조 확정 + CI
- Auth(전화번호) 기본 흐름 구현

**해야 할 일**
- 모노레포 (pnpm + turborepo)
  - `apps/mobile` (React Native)
  - `apps/desktop` (Tauri)
  - `apps/server` (NestJS)
  - `packages/shared` (타입, API client, utils)
- 디자인 토큰 (퍼플 테마) 정의 + 다크모드 토대
- Auth API 설계
  - `POST /auth/request-otp`
  - `POST /auth/verify-otp`
  - `POST /auth/refresh`
  - `POST /auth/logout`
- 보안 최소치
  - OTP 요청 rate limit (전화번호/IP)
  - 로그인 세션 (디바이스별)

**산출물**
- 앱 빌드가 돌아가고 로그인 화면 진입
- 서버/DB 마이그레이션 기본 세팅

---

### 2주차: 연락처/친구 + 1:1 채팅방 생성

**목표**
- "카톡처럼 친구 뜨는 느낌" 구현
- 1:1 채팅방 생성/목록 로딩

**해야 할 일**
- 연락처 권한 → 전화번호 정규화(E.164) → 해시 (서버로 raw를 안 보내는 방식)
- 친구 매칭 API
  - `POST /contacts/sync` (해시 목록 업로드)
  - `GET /friends`
- 채팅방 모델: 1:1은 `participants=2인 room`을 유니크하게
- UI
  - 친구 목록 → 프로필 → "채팅하기"
  - 채팅 목록 (최근 메시지 / 안 읽음 뱃지)

**산출물**
- 친구 뜸 + 친구 눌러서 1:1 방 생성 + 방 리스트에 노출

---

### 3주차: 실시간 메시징(텍스트) + ACK/읽음 기초

**목표**
- 텍스트 메시지를 실시간으로 보내고 받기
- 최소한의 신뢰성 (중복/순서/재전송 기초)

**해야 할 일**
- WebSocket 연결 + 인증 (Access token)
- 핵심 이벤트 설계/구현
- 메시지 저장 + 클라 캐시 (최근 N개)
- ACK 정책: `client_message_id(uuid)`로 멱등성 보장 (중복 전송 방지)
- 읽음 처리 기초: 방 단위 `last_read_message_id` 또는 `last_read_at`

**산출물**
- 모바일↔모바일 / 모바일↔PC 텍스트 실시간 송수신
- 전송 실패 시 재시도/상태 표시 최소 구현

---

### 4주차: 첨부(이미지/파일) 업로드 파이프라인 (Pre-signed)

**목표**
- 300MB 첨부를 안정적으로 전송
- 서버가 파일을 직접 중계하지 않게 (비용/부하 방지)

**해야 할 일**
- 업로드 플로우
  1. `POST /attachments/presign` → presigned URL + objectKey
  2. 클라가 스토리지에 직접 업로드
  3. 업로드 성공 후 `message.send`에 attachment meta 전송
- 파일 검증 (최소): 확장자/컨텐츠타입/사이즈
- 이미지 썸네일 (MVP는 클라에서 리사이징 후 업로드)

**산출물**
- 이미지/파일 전송 가능 + 채팅에서 렌더
- 300MB 파일 전송도 업로드 단계까지 안정적

---

### 5주차: 동영상 + 전송 품질 (재개/진행률/실패 복구)

**목표**
- 동영상 전송/재생
- 네트워크 끊김에도 사용성 확보

**해야 할 일**
- 업로드 진행률 UI
- 중단/재개 (MVP에선 "실패 시 재업로드"로 타협 가능)
- 동영상 썸네일 (클라 추출 추천)
- 다운로드/열기 (파일 뷰어 연결)
- 메시지 큐 (클라 로컬 큐): 오프라인이면 큐에 쌓고 온라인 시 전송

**산출물**
- 동영상 첨부 전송 + 썸네일 표시 + 기본 재생
- 업로드/전송 UX가 메신저답게 됨

---

### 6주차: 푸시 알림 + 멀티 디바이스 동기화 강화

**목표**
- 모바일 알림 필수 (FCM/APNs)
- 모바일/PC 동시 사용 시 읽음/최근 메시지 동기화

**해야 할 일**
- 디바이스 토큰 등록: `POST /devices/register`
- 알림 정책
  - 앱 포그라운드면 WS로만
  - 백그라운드/종료면 푸시
- 동기화 API
  - `GET /chats?cursor=...`
  - `GET /chats/:id/messages?cursor=...`
  - `GET /sync/state` (last read 등)
- 읽음/전달 이벤트 정교화

**산출물**
- 메시지 오면 푸시가 뜸
- PC에서 읽으면 모바일도 읽음 반영 (또는 반대)

---

### 7주차: 운영 필수 (차단/신고/레이트리밋/로그) + UI 마감

**목표**
- 악용/스팸 최소 방어
- 퍼플 테마 완성도 + UI 마감

**해야 할 일**
- 차단: `blocked` 관계 테이블 + 차단 시 메시지 수신/알림 차단
- Rate limit: OTP, 메시지 전송, presign 발급
- 관리자/운영 로그 (유저/채팅/메시지 이벤트)
- UI polish: bubble, timestamp, unread badge, empty states, skeleton, 에러 토스트/리트라이 UX

**산출물**
- MVP 운영 가능 최소선 확보
- UX가 "메신저스럽다" 수준 도달

---

### 8주차: 안정화/테스트/릴리즈 패키징

**목표**
- 버그/크래시/동기화 엣지케이스 제거
- 스토어/배포 가능한 형태로 묶기

**해야 할 일**
- 테스트: WS 재연결, 중복 메시지, 순서 뒤집힘, 대량 첨부, 느린 네트워크
- 성능: 메시지 리스트 가상화 (필수), 이미지 캐싱
- 배포: 서버 인프라 (도커, 모니터링), Sentry (클라/서버), Desktop signing/notarization

**산출물**
- 지인에게 설치 링크 주고 써보라고 할 수 있는 빌드

---

## IA (화면/메뉴 구조) — MVP 기준

**Auth**
```
전화번호 입력 → OTP 입력
```

**Main Tabs (모바일)**
```
채팅 (기본 진입)
  ├── 채팅 목록
  └── 채팅방 (메시지 리스트 / 입력 / 첨부)
친구
  ├── 친구 목록
  └── 친구 프로필 (채팅하기 / 차단)
설정
  ├── 계정 (번호/기기)
  ├── 알림 on/off (전체)
  └── 차단 목록
```

**PC 레이아웃**
```
┌──────────┬───────────────────────────┐
│ 사이드바  │         채팅방             │
│ (채팅목록)│  메시지 리스트              │
│          │  ─────────────────────────│
│          │  [입력창] [파일 드래그&드롭] │
└──────────┴───────────────────────────┘
```

---

## DB 스키마 (PostgreSQL)

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| phone_e164 | varchar UNIQUE | E.164 형식 전화번호 |
| display_name | varchar | |
| avatar_url | varchar | |
| created_at, updated_at | timestamp | |

### devices
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| user_id | fk → users | |
| device_type | enum | ios / android / desktop |
| push_token | varchar NULL | 데스크톱은 null |
| last_seen_at | timestamp | |

### contacts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| user_id | fk → users | |
| contact_hash | varchar | SHA-256 해시 |
| matched_user_id | fk NULL | 매칭된 유저 |
| created_at | timestamp | |

### friendships
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| user_id | fk → users | |
| friend_user_id | fk → users | |
| status | enum | active |
| created_at | timestamp | |

### chats
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| type | enum | direct / group |
| last_message_id | fk NULL | |
| created_at | timestamp | |

### chat_participants
| 컬럼 | 타입 | 설명 |
|------|------|------|
| chat_id | fk → chats | |
| user_id | fk → users | |
| joined_at | timestamp | |
| last_read_message_id | fk NULL | |
| last_delivered_message_id | fk NULL | |
| UNIQUE | (chat_id, user_id) | |

### messages
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| chat_id | fk → chats | INDEX (chat_id, created_at) |
| sender_id | fk → users | |
| client_message_id | uuid UNIQUE | 멱등성 보장 |
| type | enum | text / attachment / mixed |
| text | text NULL | |
| created_at | timestamp | |
| deleted_at | timestamp NULL | |

### attachments
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| message_id | fk → messages | |
| kind | enum | image / video / file |
| object_key | varchar | S3 오브젝트 키 |
| mime_type | varchar | |
| size_bytes | bigint | |
| width, height | int NULL | 이미지/영상 |
| duration_ms | int NULL | 영상 |
| thumbnail_url | varchar NULL | |

### blocks
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| user_id | fk → users | |
| blocked_user_id | fk → users | |
| created_at | timestamp | |

---

## WebSocket 이벤트 설계

### 클라 → 서버

| 이벤트 | 페이로드 | 설명 |
|--------|---------|------|
| `auth.connect` | `{ accessToken }` | WS 인증 |
| `message.send` | `{ chatId, clientMessageId, text?, attachments? }` | 메시지 전송 |
| `message.ack` | `{ messageId }` | 서버 저장 완료 확인 |
| `chat.read` | `{ chatId, lastReadMessageId }` | 읽음 처리 |
| `presence.ping` | `{ ts }` | 온라인 상태 유지 (옵션) |

### 서버 → 클라

| 이벤트 | 페이로드 | 설명 |
|--------|---------|------|
| `message.new` | `{ message }` | 새 메시지 수신 |
| `message.status` | `{ clientMessageId, status, messageId? }` | 전송 상태 (`sent` / `delivered` / `read`) |
| `chat.read_update` | `{ chatId, userId, lastReadMessageId }` | 읽음 동기화 |
| `error` | `{ code, message }` | 오류 응답 |

### 원칙

- `clientMessageId`로 **멱등 처리** (재전송해도 하나만 저장)
- 메시지 저장 성공 시 `message.status(sent)` 발행
- 상대가 WS로 받으면 `delivered`
- 상대가 채팅방 열고 `chat.read` 보내면 `read`

---

## 개발 체크리스트

- [x] 모노레포 구조 (pnpm + turborepo)
- [x] `packages/shared` — 공통 타입/상수/유틸
- [x] NestJS 서버 골격
- [x] Auth API (OTP 요청/검증/갱신/로그아웃)
- [x] Rate Limit (전화번호 + IP)
- [x] 디바이스별 세션 관리
- [x] Prisma 스키마 + Docker Compose
- [x] Flutter 앱 (iOS/Android/Windows/macOS 단일 코드베이스)
- [x] Flutter 인증 화면 (Welcome → Phone → OTP → ProfileSetup)
- [x] Flutter 메인 화면 (채팅/친구/설정)
- [x] 퍼플 디자인 토큰 시스템 (AppColors, AppTheme)
- [ ] 연락처 동기화 + 친구 매칭 (2주차)
- [ ] WebSocket 실시간 채팅 (3주차)
- [ ] 파일/이미지 Pre-signed 업로드 (4주차)
- [ ] 동영상 전송 + 진행률 UI (5주차)
- [ ] 푸시 알림 FCM/APNs (6주차)
- [ ] 차단/신고/Rate limit + UI polish (7주차)
- [ ] 안정화 + 스토어 배포 패키징 (8주차)
