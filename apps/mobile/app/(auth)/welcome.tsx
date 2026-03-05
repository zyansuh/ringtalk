import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[colors.bgLight, colors.bgMain]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* 로고 영역 */}
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🔔</Text>
        </View>
        <Text style={styles.appName}>링톡</Text>
        <Text style={styles.tagline}>가장 빠르고 안전한 메신저</Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.bottomArea}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={() => router.push('/(auth)/phone')}
        >
          <Text style={styles.primaryButtonText}>전화번호로 시작하기</Text>
        </Pressable>

        <Text style={styles.termsText}>
          시작하면{' '}
          <Text style={styles.termsLink}>서비스 이용약관</Text>
          {' '}및{' '}
          <Text style={styles.termsLink}>개인정보 처리방침</Text>
          에 동의하는 것으로 간주됩니다.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 120,
    paddingBottom: 60,
  },
  logoArea: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    ...typography.h1,
    color: colors.primary,
    fontSize: 40,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  tagline: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  bottomArea: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    ...typography.label,
    color: colors.textOnPrimary,
    fontSize: 16,
  },
  termsText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
