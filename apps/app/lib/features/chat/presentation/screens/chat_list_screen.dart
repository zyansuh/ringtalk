import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

// 플레이스홀더 데이터 (추후 API 연동)
final _rooms = [
  _Room(name: '김철수', lastMsg: '안녕하세요!', time: '오후 2:30', unread: 3),
  _Room(name: '이영희', lastMsg: '나중에 봐요', time: '오전 11:15', unread: 0),
  _Room(name: '개발팀', lastMsg: '오늘 배포합니다', time: '어제', unread: 12),
];

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      appBar: AppBar(
        title: const Text('채팅'),
        actions: [
          IconButton(icon: const Icon(Icons.edit_rounded), onPressed: () {}),
        ],
      ),
      body: _rooms.isEmpty
          ? _EmptyState(
              icon: Icons.chat_bubble_outline_rounded,
              title: '아직 채팅이 없어요',
              desc: '친구 탭에서 친구를 추가하고\n대화를 시작해 보세요!',
            )
          : ListView.separated(
              itemCount: _rooms.length,
              separatorBuilder: (_, __) => const Divider(indent: 72, height: 0),
              itemBuilder: (context, i) => _RoomTile(room: _rooms[i]),
            ),
    );
  }
}

class _RoomTile extends StatelessWidget {
  final _Room room;
  const _RoomTile({required this.room});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(
        radius: 26,
        backgroundColor: AppColors.primaryLight,
        child: Text(
          room.name[0],
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 20),
        ),
      ),
      title: Row(
        children: [
          Expanded(
            child: Text(room.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
          ),
          Text(room.time, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
        ],
      ),
      subtitle: Row(
        children: [
          Expanded(
            child: Text(
              room.lastMsg,
              style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (room.unread > 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
              child: Text(
                '${room.unread}',
                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
              ),
            ),
        ],
      ),
      onTap: () {},
    );
  }
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;
  const _EmptyState({required this.icon, required this.title, required this.desc});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 64, color: AppColors.textDisabled),
          const SizedBox(height: 16),
          Text(title, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          Text(desc, style: const TextStyle(color: AppColors.textSecondary), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

class _Room {
  final String name, lastMsg, time;
  final int unread;
  const _Room({required this.name, required this.lastMsg, required this.time, required this.unread});
}
