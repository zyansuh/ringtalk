import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { maskPhoneNumber, OTP_EXPIRES_IN } from '@ringtalk/shared';
import { useAuthStore } from '../../stores/auth.store';

const OTP_DIGIT_COUNT = 6;

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, deviceId } = (location.state ?? {}) as { phone?: string; deviceId?: string };
  const { setAuthenticated } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_DIGIT_COUNT).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRES_IN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone || !deviceId) navigate('/auth/phone');
  }, [phone, deviceId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_DIGIT_COUNT - 1) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== '')) handleVerify(next.join(''));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otp: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phone,
          otp,
          deviceId,
          deviceName: navigator.platform || 'PC',
          platform: 'windows',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? 'OTP 인증 실패');

      const { accessToken, refreshToken, isNewUser } = data.data;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      setAuthenticated('temp-id');

      navigate(isNewUser ? '/auth/profile-setup' : '/app/chats');
    } catch (e: any) {
      setError(e.message ?? 'OTP 인증에 실패했습니다.');
      setDigits(Array(OTP_DIGIT_COUNT).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>← 뒤로</button>

        <div className={styles.headerArea}>
          <h2 className={styles.title}>인증번호 입력</h2>
          <p className={styles.subtitle}>
            <strong style={{ color: 'var(--color-primary)' }}>
              {phone ? maskPhoneNumber(phone) : ''}
            </strong>
            <br />으로 발송된 6자리 인증번호를 입력하세요.
          </p>
        </div>

        <div className={styles.otpRow}>
          {Array(OTP_DIGIT_COUNT).fill(null).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              className={`${styles.otpBox} ${digits[i] ? styles.otpBoxFilled : ''}`}
              value={digits[i]}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              inputMode="numeric"
              pattern="\d*"
              disabled={isLoading}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {isLoading && <p className={styles.infoText}>인증 중...</p>}

        <div className={styles.timerRow}>
          <span className={styles.timerText}>
            {timeLeft > 0 ? (
              <>남은 시간: <strong style={{ color: 'var(--color-primary)' }}>{formatTime(timeLeft)}</strong></>
            ) : (
              <span style={{ color: 'var(--color-error)' }}>인증번호가 만료되었습니다.</span>
            )}
          </span>
          <button
            className={styles.resendButton}
            disabled={timeLeft > 150}
            onClick={() => setTimeLeft(OTP_EXPIRES_IN)}
          >
            재발송
          </button>
        </div>
      </div>
    </div>
  );
}
