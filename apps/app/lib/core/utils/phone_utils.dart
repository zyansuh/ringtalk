// 전화번호 유틸리티 (TypeScript utils/phone.ts의 Dart 버전)

/// 전화번호를 E.164 형식으로 정규화
/// 예: 01012345678 → +821012345678
String normalizePhoneNumber(String phone, {String defaultCountryCode = '82'}) {
  final digits = phone.replaceAll(RegExp(r'\D'), '');

  if (phone.startsWith('+')) return '+$digits';
  if (digits.startsWith('0')) return '+$defaultCountryCode${digits.substring(1)}';
  return '+$defaultCountryCode$digits';
}

/// E.164 전화번호 유효성 검사
bool isValidPhoneNumber(String phone) {
  return RegExp(r'^\+[1-9]\d{7,14}$').hasMatch(phone);
}

/// 전화번호 마스킹 (예: +82 ***-****-5678)
String maskPhoneNumber(String phone) {
  final normalized = normalizePhoneNumber(phone);
  if (normalized.length < 8) return '***';
  final visible = normalized.substring(normalized.length - 4);
  return '${normalized.substring(0, 3)} ***-****-$visible';
}
