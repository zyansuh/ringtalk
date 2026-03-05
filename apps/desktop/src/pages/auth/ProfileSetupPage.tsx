import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { APP_NAME } from '@ringtalk/shared';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!name.trim() || isLoading) return;
    setIsLoading(true);
    // TODO: API 연동
    setTimeout(() => navigate('/app/chats'), 500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerArea} style={{ alignItems: 'center' }}>
          <div className={styles.avatarPlaceholder}>🙂</div>
          <h2 className={styles.title}>{APP_NAME}에 오신 것을 환영해요!</h2>
          <p className={styles.subtitle}>친구들에게 보여질 이름을 설정해 주세요.</p>
        </div>

        <div className={styles.form}>
          <div>
            <label className={styles.inputLabel}>이름</label>
            <input
              className={styles.textInput}
              placeholder="이름 입력 (최대 20자)"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              autoFocus
            />
            <p className={styles.charCount}>{name.length}/20</p>
          </div>

          <button
            className={styles.primaryButton}
            onClick={handleComplete}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? '처리 중...' : '완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
