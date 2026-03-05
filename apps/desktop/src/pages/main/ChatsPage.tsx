import styles from './ChatsPage.module.css';

const PLACEHOLDER_ROOMS = [
  { id: '1', name: '김철수', lastMessage: '안녕하세요!', time: '오후 2:30', unread: 3, initials: '김' },
  { id: '2', name: '이영희', lastMessage: '나중에 봐요', time: '오전 11:15', unread: 0, initials: '이' },
  { id: '3', name: '개발팀 단체방', lastMessage: '오늘 배포합니다', time: '어제', unread: 12, initials: '개' },
];

export default function ChatsPage() {
  return (
    <div className={styles.layout}>
      {/* 채팅 목록 패널 */}
      <div className={styles.listPanel}>
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>채팅</h2>
          <button className={styles.iconButton} title="새 채팅">✏️</button>
        </div>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input className={styles.searchInput} placeholder="검색" />
        </div>

        <div className={styles.roomList}>
          {PLACEHOLDER_ROOMS.map((room) => (
            <button key={room.id} className={styles.roomItem}>
              <div className={styles.avatar}>{room.initials}</div>
              <div className={styles.roomInfo}>
                <div className={styles.roomTop}>
                  <span className={styles.roomName}>{room.name}</span>
                  <span className={styles.roomTime}>{room.time}</span>
                </div>
                <div className={styles.roomBottom}>
                  <span className={styles.lastMessage}>{room.lastMessage}</span>
                  {room.unread > 0 && (
                    <span className={styles.unreadBadge}>{room.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 채팅 상세 (빈 상태) */}
      <div className={styles.chatPanel}>
        <div className={styles.emptyChatState}>
          <span className={styles.emptyIcon}>💬</span>
          <h3 className={styles.emptyTitle}>대화를 선택해 주세요</h3>
          <p className={styles.emptyDesc}>왼쪽에서 채팅방을 선택하거나<br />새 대화를 시작해 보세요.</p>
        </div>
      </div>
    </div>
  );
}
