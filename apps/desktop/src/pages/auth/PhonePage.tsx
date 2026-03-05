import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './AuthPage.module.css';
import { normalizePhoneNumber, isValidPhoneNumber } from '@ringtalk/shared';

interface PhoneForm {
  phone: string;
}

export default function PhonePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<PhoneForm>();

  const onSubmit = async ({ phone }: PhoneForm) => {
    const normalized = normalizePhoneNumber(phone);
    if (!isValidPhoneNumber(normalized)) {
      setError('올바른 전화번호를 입력하세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const deviceId = crypto.randomUUID();
      localStorage.setItem('device_id', deviceId);

      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: normalized, deviceId, platform: 'windows' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message ?? 'OTP 발송 실패');
      }

      navigate('/auth/otp', { state: { phone: normalized, deviceId } });
    } catch (e: any) {
      setError(e.message ?? 'OTP 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← 뒤로
        </button>

        <div className={styles.headerArea}>
          <h2 className={styles.title}>전화번호 입력</h2>
          <p className={styles.subtitle}>
            링톡에서 사용할 전화번호를 입력해 주세요.
            <br />인증 문자가 발송됩니다.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputRow}>
            <div className={styles.countryCode}>🇰🇷 +82</div>
            <input
              {...register('phone', {
                required: '전화번호를 입력하세요.',
                minLength: { value: 9, message: '올바른 전화번호를 입력하세요.' },
              })}
              className={`${styles.phoneInput} ${errors.phone || error ? styles.inputError : ''}`}
              placeholder="010-0000-0000"
              type="tel"
              autoFocus
            />
          </div>

          {(errors.phone?.message || error) && (
            <p className={styles.errorText}>{errors.phone?.message || error}</p>
          )}

          <p className={styles.infoText}>
            * 전화번호는 가입 및 친구 찾기에만 사용됩니다.
          </p>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? '발송 중...' : '인증 문자 받기'}
          </button>
        </form>
      </div>
    </div>
  );
}
