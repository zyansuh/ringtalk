import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

/// 1:1 채팅방 화면 (플레이스홀더 — 3주차 실시간 메시징 연동 예정)
class ChatRoomScreen extends StatelessWidget {
  const ChatRoomScreen({
    super.key,
    required this.friendId,
    required this.friendName,
  });

  final String friendId;
  final String friendName;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDefault,
      appBar: AppBar(
        title: Text(friendName),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.chat_bubble_outline_rounded,
                size: 80,
                color: AppColors.textDisabled.withValues(alpha: 0.6),
              ),
              const SizedBox(height: 24),
              Text(
                '$friendName님과의 대화',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                '실시간 채팅 기능은 3주차에 연동 예정입니다.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
