import { useState } from 'react';
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
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as Device from 'expo-device';
import { colors, typography, spacing, radius } from '@/theme';
import { authApi } from '@/api/auth';
import { normalizePhoneNumber, isValidPhoneNumber } from '@ringtalk/shared';

interface PhoneForm {
  phone: string;
}

export default function PhoneScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<PhoneForm>({
    defaultValues: { phone: '' },
  });

  const onSubmit = async ({ phone }: PhoneForm) => {
    const normalized = normalizePhoneNumber(phone);

    if (!isValidPhoneNumber(normalized)) {
      Alert.alert('오류', '올바른 전화번호를 입력하세요.');
      return;
    }

    setIsLoading(true);
    try {
      const deviceId = Device.modelId ?? 'unknown-device';
      const platform = Platform.OS as 'ios' | 'android';

      await authApi.requestOtp({
        phoneNumber: normalized,
        deviceId,
        platform,
      });

      router.push({
        pathname: '/(auth)/otp',
        params: { phone: normalized, deviceId },
      });
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message ?? 'OTP 발송에 실패했습니다.';
      Alert.alert('오류', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← 뒤로</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.headerArea}>
          <Text style={typography.h2}>전화번호 입력</Text>
          <Text style={[typography.body2, styles.subtitle]}>
            링톡에서 사용할 전화번호를 입력해 주세요.{'\n'}인증 문자가 발송됩니다.
          </Text>
        </View>

        {/* 국가 코드 + 전화번호 입력 */}
        <View style={styles.inputRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>🇰🇷 +82</Text>
          </View>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: '전화번호를 입력하세요.',
              minLength: { value: 9, message: '올바른 전화번호를 입력하세요.' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.phoneInput, errors.phone && styles.inputError]}
                placeholder="010-0000-0000"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
                maxLength={13}
              />
            )}
          />
        </View>

        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <Text style={styles.infoText}>
          * 전화번호는 가입 및 친구 찾기에만 사용됩니다.
        </Text>
      </View>

      {/* 다음 버튼 */}
      <View style={styles.buttonArea}>
        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed, isLoading && styles.disabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.nextButtonText}>인증 문자 받기</Text>
          )}
        </Pressable>
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
    gap: spacing.lg,
  },
  headerArea: {
    gap: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  countryCode: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    ...typography.body1,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: -spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  buttonArea: {
    paddingBottom: 48,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    ...typography.label,
    color: colors.textOnPrimary,
    fontSize: 16,
  },
});
