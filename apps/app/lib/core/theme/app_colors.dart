import 'package:flutter/material.dart';

// ══════════════════════════════════════════════════════════════════
//  링톡 컬러 시스템 — 완전 라벤더·보라 유니버스
//
//  기준축: HSL 289° (Primary #B350CC)
//  원칙  : 파일 안 모든 색상이 보라(289°) 계열 DNA를 보유
//          순수 빨강·주황·초록·파랑·무채색 완전 배제
//
//  ┌─────────────────────────────────────────────────────────────┐
//  │  전체 색조 분포 (Hue 기준)                                   │
//  │                                                             │
//  │  270° ── 289° ── 310° ── 330°                               │
//  │  인디고  보라(기준) 오키드  로즈마젠타                         │
//  │   info  primary  warning  error                             │
//  │                                                             │
//  │  success = 205° (스틸블루) ← 보라의 쿨 보색, 유일한 예외지만  │
//  │  "차갑고 차분한 느낌"으로 메신저 '전송 완료'에 적합           │
//  └─────────────────────────────────────────────────────────────┘
// ══════════════════════════════════════════════════════════════════
abstract class AppColors {

  // ─── Primary (HSL 289°) ─────────────────────────────────────────────────────
  static const primary        = Color(0xFFB350CC); // H:289 S:61% L:56% — 브랜드, CTA
  static const primaryHover   = Color(0xFFBD66D2); // H:289 S:51% L:61% — hover·ripple
  static const primaryDark    = Color(0xFF9A3DB0); // H:289 S:48% L:46% — pressed
  static const primaryDeep    = Color(0xFF7B2D9C); // H:289 S:55% L:39% — 강조 포인트
  static const primarySurface = Color(0xFFF3E0FA); // H:289 S:70% L:93% — 뱃지·선택 배경

  // ─── Background (라벤더 스케일) ───────────────────────────────────────────────
  //  모든 배경에 보라 색조가 살아있어 어디를 봐도 보라 세계관 유지
  static const bgDefault = Color(0xFFF6E9F9); // H:289 S:60% L:95% — 기본 스캐폴드
  static const bgDeep    = Color(0xFFECD3F2); // H:289 S:50% L:89% — 섹션 구분·그라데이션 끝
  static const bgTinted  = Color(0xFFFEF8FF); // H:289 S:100% L:99.5% — "흰색" 대체 (보라 틴트)

  // ─── Surface / Container (보라 틴트 화이트) ────────────────────────────────────
  //  순수 흰색 #FFFFFF 완전 배제 → 모든 surface에 미세 보라 틴트 적용
  static const surfaceDefault = Color(0xFFFEF8FF); // = bgTinted — 카드·리스트 아이템
  static const surfaceSubtle  = Color(0xFFF4EBF8); // H:289 S:45% L:95.5% — 입력 필드·태그
  static const surfaceOverlay = Color(0xFFE8D4F0); // H:289 S:40% L:89% — hover·오버레이

  // ─── Text (보라-차콜 스케일) ──────────────────────────────────────────────────
  //  무채색 회색 대신 보라 색조를 품은 차콜~라이트그레이 사용
  static const textPrimary   = Color(0xFF1C0A24); // H:289 S:60% L:9%  — 헤더·중요 텍스트
  static const textSecondary = Color(0xFF664D78); // H:289 S:23% L:39% — 본문·라벨
  static const textDisabled  = Color(0xFFB09ABE); // H:289 S:18% L:68% — 플레이스홀더·비활성
  static const textOnPrimary = Color(0xFFFFFFFF); // Primary 위 텍스트

  // ─── Border / Divider (보라 스케일) ──────────────────────────────────────────
  static const borderDefault = Color(0xFFCAAAD8); // H:289 S:30% L:75% — 입력 테두리
  static const borderSubtle  = Color(0xFFE4D0EE); // H:289 S:35% L:88% — 구분선·카드 테두리

  // ─── Chat Bubble ─────────────────────────────────────────────────────────────
  static const bubbleMine       = Color(0xFFB350CC); // = primary
  static const bubbleMineText   = Color(0xFFFFFFFF);
  static const bubbleOther      = Color(0xFFFEF8FF); // = bgTinted (보라 틴트 화이트)
  static const bubbleOtherText  = Color(0xFF1C0A24);
  static const bubbleSystem     = Color(0xFFEDE0F2); // 라벤더
  static const bubbleSystemText = Color(0xFF664D78);

  // ─── Semantic (기능 색상 — 보라 유니버스 유지) ─────────────────────────────────
  //
  //  [기존]  error #D03060(크림슨), warning #C07D10(앰버), success #2D9B68(초록)
  //          → 보라와 무관한 색상들이 파일 안에서 이질감 유발
  //
  //  [변경]  모든 Semantic을 289° 인접 Hue 대역(270°~330°)으로 이동
  //          유일한 예외: success → 스틸 블루(205°) — 차분한 완료감에 최적
  //
  //  Error   H:328° 마젠타 크림슨 — 보라+핑크 = 뚜렷한 위험, 보라 계열
  static const error   = Color(0xFFC2186A); // H:328 S:78% L:43% — 마젠타 로즈

  //  Warning H:292° 다크 오키드  — 보라보다 어둡고 채도 낮아 '주의' 느낌
  static const warning = Color(0xFF9C4DAA); // H:292 S:38% L:49% — 다크 오키드

  //  Success H:205° 스틸 블루   — 보라의 차가운 보색 형제, '완료·안정'
  static const success = Color(0xFF2680A8); // H:205 S:63% L:40% — 스틸 블루

  //  Info    H:270° 인디고 퍼플  — 브랜드(289°) 직접 파생, 순수 정보
  static const info    = Color(0xFF7C4DBA); // H:270 S:44% L:52% — 인디고 바이올렛

  // ─── Presence / Online Status ────────────────────────────────────────────────
  static const online  = Color(0xFF2680A8); // = success (스틸 블루 — 차분한 온라인)
  static const offline = Color(0xFF9E8AAB); // H:289 S:13% L:60% — 퍼플-그레이 (오프라인)
  static const away    = Color(0xFF9C4DAA); // = warning (다크 오키드 — 자리 비움)
}
