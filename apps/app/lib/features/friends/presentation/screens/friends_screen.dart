import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/models/contact_model.dart';
import '../../../../core/theme/app_colors.dart';
import '../../providers/friends_provider.dart';

class FriendsScreen extends ConsumerWidget {
  const FriendsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(friendsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgDefault,
      appBar: AppBar(
        title: const Text('친구'),
        actions: [
          // 연락처 동기화 버튼
          IconButton(
            icon: state.isSyncing
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      color: AppColors.primary,
                      strokeWidth: 2.5,
                    ),
                  )
                : const Icon(Icons.sync_rounded),
            tooltip: '연락처 동기화',
            onPressed: state.isSyncing
                ? null
                : () => ref.read(friendsProvider.notifier).syncContacts(),
          ),
        ],
      ),
      body: Column(
        children: [
          // ─── 동기화 상태 배너 ───────────────────────────────────────
          if (state.syncStatus != ContactSyncStatus.idle)
            _SyncStatusBanner(state: state),

          // ─── 친구 목록 ──────────────────────────────────────────────
          Expanded(
            child: state.friends.isEmpty
                ? _EmptyFriendsView(
                    hasSynced: state.syncStatus == ContactSyncStatus.done,
                    isSyncing: state.isSyncing,
                    onSync: () => ref.read(friendsProvider.notifier).syncContacts(),
                  )
                : _FriendsList(friends: state.friends),
          ),
        ],
      ),
    );
  }
}

// ─── 동기화 상태 배너 ───────────────────────────────────────────────────────────
class _SyncStatusBanner extends StatelessWidget {
  final FriendsState state;
  const _SyncStatusBanner({required this.state});

  Color get _bgColor {
    switch (state.syncStatus) {
      case ContactSyncStatus.done:
        return AppColors.success.withValues(alpha: 0.12);
      case ContactSyncStatus.permissionDenied:
      case ContactSyncStatus.permissionPermanentlyDenied:
      case ContactSyncStatus.error:
        return AppColors.error.withValues(alpha: 0.1);
      default:
        return AppColors.primarySurface;
    }
  }

  Color get _textColor {
    switch (state.syncStatus) {
      case ContactSyncStatus.done:
        return AppColors.success;
      case ContactSyncStatus.permissionDenied:
      case ContactSyncStatus.permissionPermanentlyDenied:
      case ContactSyncStatus.error:
        return AppColors.error;
      default:
        return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: _bgColor,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          if (state.isSyncing) ...[
            const SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(
                color: AppColors.primary,
                strokeWidth: 2,
              ),
            ),
            const SizedBox(width: 10),
          ],
          Expanded(
            child: Text(
              state.syncStatusLabel,
              style: TextStyle(
                fontSize: 13,
                color: _textColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── 빈 상태 뷰 ─────────────────────────────────────────────────────────────────
class _EmptyFriendsView extends StatelessWidget {
  final bool hasSynced;
  final bool isSyncing;
  final VoidCallback onSync;

  const _EmptyFriendsView({
    required this.hasSynced,
    required this.isSyncing,
    required this.onSync,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              hasSynced
                  ? Icons.people_outline_rounded
                  : Icons.contacts_rounded,
              size: 64,
              color: AppColors.textDisabled,
            ),
            const SizedBox(height: 16),
            Text(
              hasSynced ? '링톡을 사용 중인 친구가 없어요' : '연락처를 동기화해 보세요',
              style: Theme.of(context).textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              hasSynced
                  ? '친구에게 링톡을 추천해 보세요!'
                  : '연락처에서 링톡을 사용하는\n친구를 자동으로 찾아드려요.',
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
            if (!hasSynced)
              ElevatedButton.icon(
                onPressed: isSyncing ? null : onSync,
                icon: const Icon(Icons.sync_rounded),
                label: const Text('연락처 동기화'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(200, 48),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ─── 친구 목록 ───────────────────────────────────────────────────────────────────
class _FriendsList extends StatelessWidget {
  final List<RingTalkContact> friends;
  const _FriendsList({required this.friends});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: friends.length,
      separatorBuilder: (_, __) =>
          const Divider(indent: 72, height: 0),
      itemBuilder: (context, i) => _FriendTile(contact: friends[i]),
    );
  }
}

// ─── 친구 타일 ───────────────────────────────────────────────────────────────────
class _FriendTile extends StatelessWidget {
  final RingTalkContact contact;
  const _FriendTile({required this.contact});

  @override
  Widget build(BuildContext context) {
    final profile = contact.profile;
    final name = contact.displayName;
    final initial = name.isNotEmpty ? name[0] : '?';

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(
        radius: 24,
        backgroundColor: AppColors.primaryHover,
        backgroundImage: profile?.profileImageUrl != null
            ? NetworkImage(profile!.profileImageUrl!)
            : null,
        child: profile?.profileImageUrl == null
            ? Text(
                initial,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
              )
            : null,
      ),
      title: Text(
        name,
        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
      ),
      subtitle: profile?.statusMessage != null
          ? Text(
              profile!.statusMessage!,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            )
          : null,
      trailing: TextButton(
        onPressed: () {
          // TODO 3주차: 1:1 채팅방 생성 후 이동
        },
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        ),
        child: const Text(
          '채팅하기',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
