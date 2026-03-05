import { useNavigate } from 'react-router-dom';
import styles from './WelcomePage.module.css';
import { APP_NAME } from '@ringtalk/shared';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* 로고 */}
        <div className={styles.logoArea}>
          <div className={styles.logoCircle}>
            <span className={styles.logoEmoji}>🔔</span>
          </div>
          <h1 className={styles.appName}>{APP_NAME}</h1>
          <p className={styles.tagline}>가장 빠르고 안전한 메신저</p>
        </div>

        {/* 기능 소개 */}
        <div className={styles.features}>
          {[
            { icon: '🔒', text: '엔드투엔드 암호화' },
            { icon: '⚡', text: '실시간 메시지' },
            { icon: '📱', text: '모바일 · PC 동기화' },
          ].map(({ icon, text }) => (
            <div key={text} className={styles.featureItem}>
              <span className={styles.featureIcon}>{icon}</span>
              <span className={styles.featureText}>{text}</span>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className={styles.buttonArea}>
          <button
            className={styles.primaryButton}
            onClick={() => navigate('/auth/phone')}
          >
            전화번호로 시작하기
          </button>
        </div>

        <p className={styles.terms}>
          시작하면 <a href="#" className={styles.termsLink}>서비스 이용약관</a> 및{' '}
          <a href="#" className={styles.termsLink}>개인정보 처리방침</a>에 동의합니다.
        </p>
      </div>
    </div>
  );
}
