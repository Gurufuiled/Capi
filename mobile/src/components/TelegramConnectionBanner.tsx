import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { telegramAccountStore } from '../stores/telegramAccountStore';
import { telegramConnectionStore } from '../stores/telegramConnectionStore';
import { withAlpha } from '../theme/stylePrimitives';

type Props = {
  /** `floating` — плашка поверх списка чатов, `inline` — строка над полем ввода в чате. */
  variant?: 'floating' | 'inline';
  /** Повторить загрузку (показывается, если синхронизация диалогов завершилась ошибкой). */
  onRetry?: () => void;
};

/**
 * Состояние связи с Telegram: «Нет связи», «Подключаемся…» и ошибка синхронизации с «Повторить».
 * Ничего не рисует, пока Telegram не подключён или всё в порядке.
 */
export function TelegramConnectionBanner({ variant = 'floating', onRetry }: Props) {
  const { colors } = useTheme();
  const telegramReady = telegramAccountStore((s) => s.authStatus === 'ready');
  const lastError = telegramAccountStore((s) => s.lastError);
  const connection = telegramConnectionStore((s) => s.connection);

  if (!telegramReady) return null;

  const offline = connection === 'waiting_network' || connection === 'connecting_proxy';
  const connecting = connection === 'connecting';

  let label: string | null = null;
  let showSpinner = false;
  let showRetry = false;
  if (offline) {
    label = variant === 'inline' ? 'Нет связи с Telegram. Сообщение уйдёт, когда связь вернётся' : 'Нет связи с Telegram';
  } else if (connecting) {
    label = 'Подключаемся к Telegram…';
    showSpinner = true;
  } else if (lastError && variant === 'floating') {
    label = lastError;
    showRetry = Boolean(onRetry);
  }
  if (!label) return null;

  const content = (
    <View
      style={[
        styles.pill,
        variant === 'inline' && styles.pillInline,
        { backgroundColor: withAlpha(offline || lastError ? '#E5484D' : colors.accent, 0.14) },
      ]}
    >
      {showSpinner ? <ActivityIndicator size="small" color={colors.accent} /> : null}
      <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={2}>
        {label}
      </Text>
      {showRetry ? (
        <Pressable onPress={onRetry} hitSlop={8} style={styles.retry}>
          <Text style={[styles.retryText, { color: colors.accent }]}>Повторить</Text>
        </Pressable>
      ) : null}
    </View>
  );

  if (variant === 'inline') return content;
  return (
    <View pointerEvents="box-none" style={styles.host}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    minHeight: 36,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: '92%',
  },
  pillInline: {
    alignSelf: 'center',
    marginBottom: 6,
  },
  label: { flexShrink: 1, fontSize: 13, lineHeight: 17, fontWeight: '600' },
  retry: { minHeight: 36, justifyContent: 'center' },
  retryText: { fontSize: 13, fontWeight: '800' },
});
