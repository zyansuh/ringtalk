import styles from './FriendsPage.module.css';

export default function FriendsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>친구</h2>
        <button className={styles.addButton}>+ 친구 추가</button>
      </div>
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>👥</span>
        <h3 className={styles.emptyTitle}>아직 친구가 없어요</h3>
        <p className={styles.emptyDesc}>연락처를 동기화하거나 전화번호로 친구를 찾아보세요.</p>
      </div>
    </div>
  );
}
