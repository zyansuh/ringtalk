import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import { colors, typography, spacing, radius } from '@/theme';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/auth.store';
import { maskPhoneNumber, OTP_EXPIRES_IN } from '@ringtalk/shared';

const OTP_DIGIT_COUNT = 6;

export default function OtpScreen() {
  const { phone, deviceId } = useLocalSearchParams<{ phone: string; deviceId: string }>();
  const { setAuthenticated } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_DIGIT_COUNT).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRES_IN);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // 카운트다운 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // OTP 자동 제출
  useEffect(() => {
    const otp = digits.join('');
    if (otp.length === OTP_DIGIT_COUNT) {
      handleVerify(otp);
    }
  }, [digits]);

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < OTP_DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otp: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const platform = Platform.OS as 'ios' | 'android';
      const deviceName = Device.deviceName ?? '알 수 없는 기기';

      const result = await authApi.verifyOtp({
        phoneNumber: phone,
        otp,
        deviceId,
        deviceName,
        platform,
      });

      await SecureStore.setItemAsync('user_id', result.isNewUser ? 'new' : 'existing');
      setAuthenticated('temp-id');

      if (result.isNewUser) {
        router.replace('/(auth)/profile-setup');
      } else {
        router.replace('/(main)/chats');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message ?? 'OTP 인증에 실패했습니다.';
      Alert.alert('인증 실패', msg);
      setDigits(Array(OTP_DIGIT_COUNT).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authApi.requestOtp({
        phoneNumber: phone,
        deviceId,
        platform: Platform.OS as 'ios' | 'android',
      });
      setTimeLeft(OTP_EXPIRES_IN);
      setDigits(Array(OTP_DIGIT_COUNT).fill(''));
      inputRefs.current[0]?.focus();
      Alert.alert('재발송 완료', '새로운 인증번호를 발송했습니다.');
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message ?? '재발송에 실패했습니다.';
      Alert.alert('오류', msg);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← 뒤로</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.headerArea}>
          <Text style={typography.h2}>인증번호 입력</Text>
          <Text style={[typography.body2, styles.subtitle]}>
            <Text style={styles.phoneHighlight}>{maskPhoneNumber(phone)}</Text>
            {'\n'}으로 발송된 6자리 인증번호를 입력하세요.
          </Text>
        </View>

        {/* OTP 입력 박스 */}
        <View style={styles.otpRow}>
          {Array(OTP_DIGIT_COUNT).fill(null).map((_, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputRefs.current[i] = ref; }}
              style={[
                styles.otpBox,
                digits[i] ? styles.otpBoxFilled : undefined,
                isLoading ? styles.otpBoxDisabled : undefined,
              ]}
              value={digits[i]}
              onChangeText={(text) => handleDigitChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
              autoFocus={i === 0}
            />
          ))}
        </View>

        {/* 타이머 + 재발송 */}
        <View style={styles.timerRow}>
          {timeLeft > 0 ? (
            <Text style={styles.timerText}>
              남은 시간: <Text style={styles.timerHighlight}>{formatTime(timeLeft)}</Text>
            </Text>
          ) : (
            <Text style={styles.expiredText}>인증번호가 만료되었습니다.</Text>
          )}

          <Pressable
            onPress={handleResend}
            disabled={isResending || timeLeft > 150}
            style={({ pressed }) => [
              styles.resendButton,
              (isResending || timeLeft > 150) && styles.resendDisabled,
              pressed && styles.pressed,
            ]}
          >
            {isResending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[
                styles.resendText,
                timeLeft > 150 && styles.resendTextDisabled,
              ]}>
                재발송
              </Text>
            )}
          </Pressable>
        </View>

        {isLoading && (
          <View style={styles.verifyingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.verifyingText}>인증 중...</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: spacing.xl,
  },
  backText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    gap: spacing.xl,
  },
  headerArea: {
    gap: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  phoneHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceDefault,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.bgLight,
  },
  otpBoxDisabled: {
    opacity: 0.6,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  timerHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  expiredText: {
    ...typography.body2,
    color: colors.error,
  },
  resendButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    minWidth: 64,
    alignItems: 'center',
  },
  resendDisabled: {
    borderColor: colors.borderDefault,
  },
  resendText: {
    ...typography.label,
    color: colors.primary,
  },
  resendTextDisabled: {
    color: colors.textDisabled,
  },
  pressed: {
    opacity: 0.7,
  },
  verifyingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  verifyingText: {
    ...typography.body2,
    color: colors.primary,
  },
});
