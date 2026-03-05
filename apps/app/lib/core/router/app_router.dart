import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../features/auth/presentation/screens/welcome_screen.dart';
import '../../features/auth/presentation/screens/phone_screen.dart';
import '../../features/auth/presentation/screens/otp_screen.dart';
import '../../features/auth/presentation/screens/profile_setup_screen.dart';
import '../../features/chat/presentation/screens/chat_list_screen.dart';
import '../../features/friends/presentation/screens/friends_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';
import '../storage/auth_storage.dart';
import '../../shared/widgets/main_shell.dart';

part 'app_router.g.dart';

@riverpod
GoRouter router(Ref ref) {
  final isAuthenticated = ref.watch(isAuthenticatedProvider);

  return GoRouter(
    initialLocation: isAuthenticated ? '/chats' : '/welcome',
    redirect: (context, state) {
      final loggedIn = isAuthenticated;
      final onAuth = state.matchedLocation.startsWith('/welcome') ||
          state.matchedLocation.startsWith('/phone') ||
          state.matchedLocation.startsWith('/otp') ||
          state.matchedLocation.startsWith('/profile-setup');

      if (!loggedIn && !onAuth) return '/welcome';
      if (loggedIn && onAuth) return '/chats';
      return null;
    },
    routes: [
      // ─── 인증 ───────────────────────────────
      GoRoute(path: '/welcome', builder: (_, __) => const WelcomeScreen()),
      GoRoute(path: '/phone', builder: (_, __) => const PhoneScreen()),
      GoRoute(
        path: '/otp',
        builder: (_, state) {
          final extra = state.extra as Map<String, String>;
          return OtpScreen(phone: extra['phone']!, deviceId: extra['deviceId']!);
        },
      ),
      GoRoute(path: '/profile-setup', builder: (_, __) => const ProfileSetupScreen()),

      // ─── 메인 (탭 셸) ───────────────────────
      ShellRoute(
        builder: (_, __, child) => MainShell(child: child),
        routes: [
          GoRoute(path: '/chats', builder: (_, __) => const ChatListScreen()),
          GoRoute(path: '/friends', builder: (_, __) => const FriendsScreen()),
          GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
        ],
      ),
    ],
  );
}
