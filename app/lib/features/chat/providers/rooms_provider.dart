import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/chat_model.dart';
import '../data/rooms_repository.dart';

final roomsRepositoryProvider = Provider<RoomsRepository>(
  (_) => RoomsRepository(),
);

enum RoomsLoadStatus { idle, loading, done, error }

class RoomsState {
  final RoomsLoadStatus status;
  final List<ChatRoom> rooms;
  final String? errorMessage;

  const RoomsState({
    this.status = RoomsLoadStatus.idle,
    this.rooms = const [],
    this.errorMessage,
  });

  RoomsState copyWith({
    RoomsLoadStatus? status,
    List<ChatRoom>? rooms,
    Object? errorMessage = _undefined,
  }) =>
      RoomsState(
        status: status ?? this.status,
        rooms: rooms ?? this.rooms,
        errorMessage: identical(errorMessage, _undefined)
            ? this.errorMessage
            : errorMessage as String?,
      );
}

const _undefined = Object();

class RoomsNotifier extends StateNotifier<RoomsState> {
  final Ref _ref;

  RoomsNotifier(this._ref) : super(const RoomsState());

  Future<void> fetchRooms() async {
    state = state.copyWith(status: RoomsLoadStatus.loading);
    try {
      final repo = _ref.read(roomsRepositoryProvider);
      final rooms = await repo.fetchRooms();
      state = state.copyWith(
        status: RoomsLoadStatus.done,
        rooms: rooms,
      );
    } catch (e) {
      state = state.copyWith(
        status: RoomsLoadStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  /// 1:1 방 생성/조회 후 반환
  Future<ChatRoom?> getOrCreateDirectRoom(String participantId) async {
    try {
      final repo = _ref.read(roomsRepositoryProvider);
      final room = await repo.createDirectRoom(participantId);
      // 목록에 없으면 추가
      final exists = state.rooms.any((r) => r.id == room.id);
      if (!exists) {
        state = state.copyWith(
          rooms: [room, ...state.rooms],
        );
      }
      return room;
    } catch (e) {
      state = state.copyWith(
        status: RoomsLoadStatus.error,
        errorMessage: e.toString(),
      );
      return null;
    }
  }
}

final roomsProvider = StateNotifierProvider<RoomsNotifier, RoomsState>(
  (ref) => RoomsNotifier(ref),
);
