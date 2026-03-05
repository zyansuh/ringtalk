import { Colors as SharedColors } from '@ringtalk/shared';

// 공유 색상을 그대로 사용 + 모바일 전용 추가
export const colors = {
  ...SharedColors,

  // 모바일 전용 색상
  tabBarBackground: '#ffffff',
  tabBarBorder: SharedColors.borderDefault,
  tabBarActive: SharedColors.primary,
  tabBarInactive: SharedColors.textDisabled,

  inputBackground: '#f5edf8',
  inputBorder: SharedColors.borderDefault,
  inputFocusBorder: SharedColors.primary,
  inputPlaceholder: SharedColors.textDisabled,

  overlayBackground: 'rgba(26, 10, 30, 0.5)',

  // 채팅 화면
  chatBackground: '#f0dff5',
  readReceipt: SharedColors.primaryLight,
};

export type ColorKey = keyof typeof colors;
