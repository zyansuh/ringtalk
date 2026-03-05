// 앱 전역 상수

export const APP_NAME = '링톡';
export const APP_VERSION = '0.1.0';

// 인증
export const OTP_LENGTH = 6;
export const OTP_EXPIRES_IN = 180; // 3분 (초)
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RATE_LIMIT_WINDOW = 600; // 10분 (초)
export const OTP_RATE_LIMIT_MAX = 3; // 10분 내 최대 3번 요청

export const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';

// 페이지네이션
export const DEFAULT_PAGE_SIZE = 30;
export const MAX_PAGE_SIZE = 100;
export const MESSAGE_PAGE_SIZE = 50;

// 메시지
export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_FILE_SIZE_MB = 100;

// 링톡 컬러 시스템
// 기준: Primary #B350CC (HSL 289°) — 모든 색상이 보라 계열 세계관으로 통일
export const Colors = {
  // ─── Primary ────────────────────────────────────────────────────────────────
  primary:        '#b350cc', // HSL 289 61% 56% — CTA, 활성 탭, 버튼
  primaryHover:   '#bd66d2', // HSL 289 51% 61% — hover/ripple
  primaryDark:    '#9a3db0', // HSL 289 48% 46% — pressed
  primarySurface: '#f3e0fa', // HSL 289 70% 93% — 배지 배경, 선택 영역

  // ─── Background ─────────────────────────────────────────────────────────────
  bgDefault: '#f6e9f9', // HSL 289 60% 95% — 기본 스캐폴드 배경
  bgDeep:    '#ecd3f2', // HSL 289 50% 89% — 섹션 구분 / 그라데이션 끝
  bgWhite:   '#ffffff', // 카드, 모달, 입력 배경

  // ─── Surface / Container ────────────────────────────────────────────────────
  surfaceDefault: '#ffffff',  // 카드 / 리스트 아이템
  surfaceSubtle:  '#f8f0fa',  // HSL 289 40% 97% — 입력 필드, 태그 배경
  surfaceOverlay: '#ede5f2',  // HSL 289 30% 93% — 오버레이, hover 상태

  // ─── Text ───────────────────────────────────────────────────────────────────
  textPrimary:   '#1a0a1e', // HSL 289 47%  8% — 헤더, 중요 텍스트
  textSecondary: '#6b5572', // HSL 289 15% 37% — 본문, 라벨
  textDisabled:  '#b8a8be', // HSL 289 13% 70% — 플레이스홀더, 비활성
  textOnPrimary: '#ffffff', // Primary 위 텍스트

  // ─── Border / Divider ───────────────────────────────────────────────────────
  borderDefault: '#d4b8dc', // HSL 289 25% 79%
  borderSubtle:  '#ede5f2', // HSL 289 30% 93%

  // ─── Chat Bubble ────────────────────────────────────────────────────────────
  bubbleMine:       '#b350cc', // 내 말풍선 = Primary
  bubbleMineText:   '#ffffff',
  bubbleOther:      '#ffffff', // 상대 말풍선
  bubbleOtherText:  '#1a0a1e',
  bubbleSystem:     '#ede0f2', // 시스템 메시지 배경
  bubbleSystemText: '#6b5572',

  // ─── Semantic ───────────────────────────────────────────────────────────────
  // 의미 전달 유지 + 보라 계열로 보정하여 팔레트 통일
  error:   '#d03060', // crimson rose  — 오류, 위험 (빨강이지만 보라 색조 혼합)
  warning: '#c07d10', // amber brown   — 경고, 주의 (주황이지만 채도 낮추고 따뜻하게)
  success: '#2d9b68', // teal green    — 성공, 완료 (초록이지만 차갑게 기울여 보라와 조화)
  info:    '#7c4dba', // purple violet — 정보, 안내 (브랜드 계열에서 직접 파생)

  // ─── Presence ───────────────────────────────────────────────────────────────
  online:  '#2d9b68', // = success
  offline: '#9e8aab', // HSL 289 13% 60% — 퍼플-그레이
  away:    '#c07d10', // = warning
} as const;

// API 엔드포인트
export const ApiEndpoints = {
  auth: {
    requestOtp: '/auth/request-otp',
    verifyOtp: '/auth/verify-otp',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    sessions: '/auth/sessions',
  },
  users: {
    me: '/users/me',
    profile: (id: string) => `/users/${id}`,
    friends: '/users/me/friends',
    addFriend: '/users/me/friends',
    blockUser: (id: string) => `/users/${id}/block`,
    searchByPhone: '/users/search',
  },
  rooms: {
    list: '/rooms',
    create: '/rooms',
    detail: (id: string) => `/rooms/${id}`,
    messages: (id: string) => `/rooms/${id}/messages`,
    sendMessage: (id: string) => `/rooms/${id}/messages`,
    readMessage: (id: string) => `/rooms/${id}/read`,
  },
  media: {
    upload: '/media/upload',
    presigned: '/media/presigned-url',
  },
} as const;

// WebSocket 이벤트
export const WsEvents = {
  // 연결
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',

  // 메시지
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_STATUS: 'message:status',
  MESSAGE_DELETE: 'message:delete',
  MESSAGE_DELETED: 'message:deleted',

  // 방
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATED: 'room:updated',

  // 유저 상태
  USER_TYPING_START: 'user:typing:start',
  USER_TYPING_STOP: 'user:typing:stop',
  USER_TYPING: 'user:typing',
  USER_PRESENCE: 'user:presence',
  USER_READ: 'user:read',
} as const;
