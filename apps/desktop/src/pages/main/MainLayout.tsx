import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';
import ChatsPage from './ChatsPage';
import FriendsPage from './FriendsPage';
import SettingsPage from './SettingsPage';
import { APP_NAME } from '@ringtalk/shared';
import { useAuthStore } from '../../stores/auth.store';

const NAV_ITEMS = [
  { path: 'chats', icon: '💬', label: '채팅' },
  { path: 'friends', icon: '👥', label: '친구' },
  { path: 'settings', icon: '⚙️', label: '설정' },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const { setUnauthenticated } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUnauthenticated();
    navigate('/auth/welcome');
  };

  return (
    <div className={styles.layout}>
      {/* 사이드바 */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <span className={styles.logoEmoji}>🔔</span>
            <span className={styles.logoText}>{APP_NAME}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={`/app/${item.path}`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <span>🚪</span>
          <span>로그아웃</span>
        </button>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className={styles.main}>
        <Routes>
          <Route path="chats" element={<ChatsPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="chats" replace />} />
        </Routes>
      </main>
    </div>
  );
}
