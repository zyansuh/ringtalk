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
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/theme';
import { APP_NAME } from '@ringtalk/shared';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    // TODO: API 연동 - 프로필 설정
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(main)/chats');
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.headerArea}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarEmoji}>🙂</Text>
          </View>
          <Text style={typography.h2}>{APP_NAME}에 오신 것을 환영해요!</Text>
          <Text style={[typography.body2, styles.subtitle]}>
            친구들에게 보여질 이름을 설정해 주세요.
          </Text>
        </View>

        <View style={styles.inputArea}>
          <Text style={[typography.label, styles.inputLabel]}>이름</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="이름 입력 (최대 20자)"
            placeholderTextColor={colors.inputPlaceholder}
            value={name}
            onChangeText={setName}
            maxLength={20}
            autoFocus
          />
          <Text style={styles.charCount}>{name.length}/20</Text>
        </View>
      </View>

      <View style={styles.buttonArea}>
        <Pressable
          style={({ pressed }) => [
            styles.completeButton,
            !name.trim() && styles.disabled,
            pressed && name.trim() && styles.pressed,
          ]}
          onPress={handleComplete}
          disabled={!name.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.completeButtonText}>완료</Text>
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
    paddingTop: 80,
  },
  content: {
    flex: 1,
    gap: spacing.xl,
  },
  headerArea: {
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 44,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputArea: {
    gap: spacing.xs,
  },
  inputLabel: {
    color: colors.textSecondary,
  },
  nameInput: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
  },
  charCount: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  buttonArea: {
    paddingBottom: 48,
  },
  completeButton: {
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
    backgroundColor: colors.borderDefault,
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    ...typography.label,
    color: colors.textOnPrimary,
    fontSize: 16,
  },
});
