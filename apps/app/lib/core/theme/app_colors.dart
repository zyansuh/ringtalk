import 'package:flutter/material.dart';

// 링톡 컬러 시스템
// 기준 색상: Primary #B350CC (HSL 289°, 61%, 56%)
// 모든 색상이 동일 색조(Hue) 계열에서 파생 — 보라/연보라 세계관 통일
abstract class AppColors {
  // ─── Primary ────────────────────────────────────────────────────────────────
  // #B350CC 기준 — CTA, 활성 탭, 버튼
  static const primary      = Color(0xFFB350CC); // HSL 289 61% 56%
  static const primaryHover = Color(0xFFBD66D2); // HSL 289 51% 61% — hover/ripple
  static const primaryDark  = Color(0xFF9A3DB0); // HSL 289 48% 46% — pressed
  static const primarySurface = Color(0xFFF3E0FA); // HSL 289 70% 93% — 배지 배경, 선택 영역

  // ─── Background ─────────────────────────────────────────────────────────────
  // #F6E9F9(bgDefault) → #ECD3F2(bgDeep) 그라데이션 기반
  static const bgDefault = Color(0xFFF6E9F9); // HSL 289 60% 95% — 기본 스캐폴드 배경
  static const bgDeep    = Color(0xFFECD3F2); // HSL 289 50% 89% — 섹션 구분 / 그라데이션 끝
  static const bgWhite   = Color(0xFFFFFFFF); // 카드, 모달, 입력 배경

  // ─── Surface / Container ────────────────────────────────────────────────────
  static const surfaceDefault = Color(0xFFFFFFFF); // 카드 / 리스트 아이템
  static const surfaceSubtle  = Color(0xFFF8F0FA); // HSL 289 40% 97% — 입력 필드, 태그 배경
  static const surfaceOverlay = Color(0xFFEDE5F2); // HSL 289 30% 93% — 오버레이, hover 상태

  // ─── Text ───────────────────────────────────────────────────────────────────
  // 중성(흰/검)이 아닌 보라-차콜 계열로 전체 텍스트 통일
  static const textPrimary   = Color(0xFF1A0A1E); // HSL 289 47%  8% — 헤더, 중요 텍스트
  static const textSecondary = Color(0xFF6B5572); // HSL 289 15% 37% — 본문, 라벨
  static const textDisabled  = Color(0xFFB8A8BE); // HSL 289 13% 70% — 플레이스홀더, 비활성
  static const textOnPrimary = Color(0xFFFFFFFF); // Primary 위 텍스트

  // ─── Border / Divider ───────────────────────────────────────────────────────
  static const borderDefault = Color(0xFFD4B8DC); // HSL 289 25% 79% — 입력 테두리
  static const borderSubtle  = Color(0xFFEDE5F2); // HSL 289 30% 93% — 구분선, 카드 테두리

  // ─── Chat Bubble ────────────────────────────────────────────────────────────
  static const bubbleMine       = Color(0xFFB350CC); // 내 말풍선 = Primary
  static const bubbleMineText   = Color(0xFFFFFFFF);
  static const bubbleOther      = Color(0xFFFFFFFF); // 상대 말풍선
  static const bubbleOtherText  = Color(0xFF1A0A1E);
  static const bubbleSystem     = Color(0xFFEDE0F2); // 시스템 메시지 배경
  static const bubbleSystemText = Color(0xFF6B5572);

  // ─── Semantic (기능 색상) ────────────────────────────────────────────────────
  // 의미 전달을 유지하되 순수 원색 대신 보라 계열로 보정한 색상 사용
  //  Error   → 크림슨 로즈   (빨강 계열이나 보라 색조 혼합, 덜 자극적)
  //  Warning → 앰버 브라운   (주황 계열이나 따뜻하고 채도 낮춤)
  //  Success → 틸 그린       (초록 계열이나 차갑게 기울여 보라와 잘 어울림)
  //  Info    → 퍼플 바이올렛  (브랜드 계열에서 직접 파생, 완전 통일)
  static const error   = Color(0xFFD03060); // crimson rose — 오류, 위험
  static const warning = Color(0xFFC07D10); // amber brown  — 경고, 주의
  static const success = Color(0xFF2D9B68); // teal green   — 성공, 완료
  static const info    = Color(0xFF7C4DBA); // purple violet — 정보, 안내 (브랜드 계열)

  // ─── Presence / Status ──────────────────────────────────────────────────────
  // Semantic 색상과 쌍을 이뤄 동일 색상 풀 사용
  static const online  = Color(0xFF2D9B68); // = success (온라인)
  static const offline = Color(0xFF9E8AAB); // HSL 289 13% 60% — 퍼플-그레이 (오프라인)
  static const away    = Color(0xFFC07D10); // = warning (자리 비움)
}
