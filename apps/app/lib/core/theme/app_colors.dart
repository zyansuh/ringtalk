import 'package:flutter/material.dart';

/// 링톡 퍼플 테마 색상 토큰
abstract class AppColors {
  // Primary
  static const primary = Color(0xFFB350CC);
  static const primaryLight = Color(0xFFBD66D2);
  static const primaryDark = Color(0xFF9A3DB0);

  // Background
  static const bgMain = Color(0xFFECD3F2);
  static const bgLight = Color(0xFFF6E9F9);
  static const bgWhite = Color(0xFFFFFFFF);

  // Text
  static const textPrimary = Color(0xFF1A0A1E);
  static const textSecondary = Color(0xFF6B5572);
  static const textDisabled = Color(0xFFB8A8BE);
  static const textOnPrimary = Color(0xFFFFFFFF);

  // Surface
  static const surfaceDefault = Color(0xFFFFFFFF);
  static const surfaceSubtle = Color(0xFFF8F0FA);

  // Border
  static const borderDefault = Color(0xFFD4B8DC);
  static const borderSubtle = Color(0xFFE8D5EE);

  // Bubble
  static const bubbleMine = Color(0xFFB350CC);
  static const bubbleMineText = Color(0xFFFFFFFF);
  static const bubbleOther = Color(0xFFFFFFFF);
  static const bubbleOtherText = Color(0xFF1A0A1E);
  static const bubbleSystem = Color(0xFFEDE0F2);
  static const bubbleSystemText = Color(0xFF6B5572);

  // Status
  static const error = Color(0xFFE53935);
  static const warning = Color(0xFFFB8C00);
  static const success = Color(0xFF43A047);
  static const info = Color(0xFF1E88E5);

  // Presence
  static const online = Color(0xFF43A047);
  static const offline = Color(0xFF9E9E9E);
  static const away = Color(0xFFFB8C00);
}
