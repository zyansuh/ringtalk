import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import { useAuthStore } from '../../stores/auth.store';
import { APP_NAME } from '@ringtalk/shared';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { setUnauthenticated } = useAuthStore();

  const handleLogout = () => {
    if (confirm('정말 로그아웃하시겠어요?')) {
      localStorage.clear();
      setUnauthenticated();
      navigate('/auth/welcome');
    }
  };

  const menuGroups = [
    {
      title: '계정',
      items: [
        { icon: '👤', label: '프로필 편집', desc: '이름, 사진, 상태 메시지' },
        { icon: '🔔', label: '알림 설정', desc: '소리, 배너, 진동' },
      ],
    },
    {
      title: '보안',
      items: [
        { icon: '🔒', label: '개인정보 보호', desc: '마지막 접속, 프로필 사진 공개 범위' },
        { icon: '📱', label: '로그인된 기기', desc: '연결된 디바이스 관리' },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>설정</h2>
      </div>

      {/* 프로필 카드 */}
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>나</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>내 프로필</span>
            <span className={styles.profileSub}>상태 메시지를 설정해 보세요</span>
          </div>
          <span className={styles.arrow}>›</span>
        </div>
      </div>

      {/* 메뉴 그룹 */}
      {menuGroups.map((group) => (
        <div key={group.title} className={styles.menuGroup}>
          <p className={styles.groupTitle}>{group.title}</p>
          <div className={styles.menuList}>
            {group.items.map((item) => (
              <button key={item.label} className={styles.menuItem}>
                <span className={styles.menuIcon}>{item.icon}</span>
                <div className={styles.menuText}>
                  <span className={styles.menuLabel}>{item.label}</span>
                  <span className={styles.menuDesc}>{item.desc}</span>
                </div>
                <span className={styles.arrow}>›</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* 하단 */}
      <div className={styles.bottomSection}>
        <p className={styles.version}>{APP_NAME} v0.1.0 (Desktop)</p>
        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
