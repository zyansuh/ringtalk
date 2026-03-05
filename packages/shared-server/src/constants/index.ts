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

// 디자인 토큰 색상 (공유)
export const Colors = {
  // Primary
  primary: '#b350cc',
  primaryLight: '#bd66d2',
  primaryDark: '#9a3db0',

  // Background
  bgMain: '#ecd3f2',
  bgLight: '#f6e9f9',
  bgWhite: '#ffffff',

  // Text
  textPrimary: '#1a0a1e', // 거의 검정에 가까운 보라
  textSecondary: '#6b5572',
  textDisabled: '#b8a8be',
  textOnPrimary: '#ffffff',

  // Surface
  surfaceDefault: '#ffffff',
  surfaceSubtle: '#f8f0fa',
  surfaceElevated: '#ffffff',

  // Border
  borderDefault: '#d4b8dc',
  borderSubtle: '#e8d5ee',

  // Bubble
  bubbleMine: '#b350cc',
  bubbleMineText: '#ffffff',
  bubbleOther: '#ffffff',
  bubbleOtherText: '#1a0a1e',
  bubbleSystem: '#ede0f2',
  bubbleSystemText: '#6b5572',

  // Status
  error: '#e53935',
  warning: '#fb8c00',
  success: '#43a047',
  info: '#1e88e5',

  // Presence
  online: '#43a047',
  offline: '#9e9e9e',
  away: '#fb8c00',
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
