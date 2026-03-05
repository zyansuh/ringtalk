import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>친구</Text>
        <Pressable>
          <Text style={styles.addIcon}>➕</Text>
        </Pressable>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>👥</Text>
        <Text style={[typography.h3, styles.emptyTitle]}>아직 친구가 없어요</Text>
        <Text style={[typography.body2, styles.emptyDesc]}>
          연락처를 동기화하거나{'\n'}전화번호로 친구를 찾아보세요.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerTitle: { ...typography.h3 },
  addIcon: { fontSize: 22 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { color: colors.textPrimary },
  emptyDesc: { color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
