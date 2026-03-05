import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/api/auth';
import { APP_NAME } from '@ringtalk/shared';

export default function SettingsScreen() {
  const { setUnauthenticated } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await authApi.logout();
          setUnauthenticated();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const menuItems = [
    { icon: '👤', label: '프로필 편집', onPress: () => {} },
    { icon: '🔔', label: '알림 설정', onPress: () => {} },
    { icon: '🔒', label: '개인정보 보호', onPress: () => {} },
    { icon: '📱', label: '로그인된 기기', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      {/* 프로필 카드 */}
      <Pressable style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>나</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>내 프로필</Text>
          <Text style={styles.profileStatus}>상태 메시지를 설정해 보세요</Text>
        </View>
        <Text style={styles.profileArrow}>›</Text>
      </Pressable>

      {/* 메뉴 목록 */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </View>

      {/* 버전 + 로그아웃 */}
      <View style={styles.bottomSection}>
        <Text style={styles.versionText}>{APP_NAME} v0.1.0</Text>
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bgWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerTitle: { ...typography.h3 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgWhite,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: { color: colors.textOnPrimary, fontSize: 24, fontWeight: '700' },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { ...typography.label, color: colors.textPrimary },
  profileStatus: { ...typography.caption, color: colors.textSecondary },
  profileArrow: { fontSize: 22, color: colors.textDisabled },
  menuSection: {
    backgroundColor: colors.bgWhite,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  menuIcon: { fontSize: 20 },
  menuLabel: { ...typography.body1, flex: 1, color: colors.textPrimary },
  menuArrow: { fontSize: 20, color: colors.textDisabled },
  pressed: { backgroundColor: colors.surfaceSubtle },
  bottomSection: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  versionText: { ...typography.caption, color: colors.textDisabled },
  logoutButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  logoutText: { ...typography.label, color: colors.error },
});
