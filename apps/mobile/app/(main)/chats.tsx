import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/theme';

// 채팅 목록 플레이스홀더 (추후 실제 API 연동)
const PLACEHOLDER_ROOMS = [
  { id: '1', name: '김철수', lastMessage: '안녕하세요!', time: '오후 2:30', unread: 3 },
  { id: '2', name: '이영희', lastMessage: '나중에 봐요', time: '오전 11:15', unread: 0 },
];

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>채팅</Text>
        <Pressable style={styles.newChatButton}>
          <Text style={styles.newChatIcon}>✏️</Text>
        </Pressable>
      </View>

      {PLACEHOLDER_ROOMS.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={[typography.h3, styles.emptyTitle]}>아직 채팅이 없어요</Text>
          <Text style={[typography.body2, styles.emptyDesc]}>
            친구 탭에서 친구를 추가하고{'\n'}대화를 시작해 보세요!
          </Text>
        </View>
      ) : (
        <FlatList
          data={PLACEHOLDER_ROOMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={({ pressed }) => [styles.roomItem, pressed && styles.pressed]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>
              <View style={styles.roomInfo}>
                <View style={styles.roomTop}>
                  <Text style={styles.roomName}>{item.name}</Text>
                  <Text style={styles.roomTime}>{item.time}</Text>
                </View>
                <View style={styles.roomBottom}>
                  <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.bgWhite,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  newChatButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatIcon: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyEmoji: {
    fontSize: 60,
  },
  emptyTitle: {
    color: colors.textPrimary,
  },
  emptyDesc: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  roomItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: colors.surfaceSubtle,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  roomInfo: {
    flex: 1,
    gap: 4,
  },
  roomTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  roomTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  roomBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.body2,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginLeft: 52 + spacing.lg + spacing.md,
  },
});
