import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

/// 채팅방 화면 (roomId 기반 — 메시지 로드/전송은 추후 연동)
class ChatRoomScreen extends StatelessWidget {
  const ChatRoomScreen({
    super.key,
    required this.roomId,
    this.displayName,
  });

  final String roomId;
  final String? displayName;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDefault,
      appBar: AppBar(
        title: Text(displayName ?? '채팅'),
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
                displayName != null ? '$displayName님과의 대화' : '채팅방',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                '메시지 전송 기능은 추후 연동 예정입니다.',
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
