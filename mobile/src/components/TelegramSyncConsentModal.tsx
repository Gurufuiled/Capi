import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import { applyTelegramSync } from '../services/telegramSyncGate';
import { telegramConsentStore } from '../stores/telegramConsentStore';
import { withAlpha } from '../theme/stylePrimitives';
import { CapiIcon } from './capi/CapiIcon';

/** Экран согласия после входа в Telegram: оба пункта выключены по умолчанию. */
export function TelegramSyncConsentModal() {
  const { colors } = useTheme();
  const visible = telegramConsentStore((s) => s.promptVisible);
  const [sharePhone, setSharePhone] = useState(false);
  const [syncContacts, setSyncContacts] = useState(false);

  useEffect(() => {
    if (visible) {
      setSharePhone(false);
      setSyncContacts(false);
    }
  }, [visible]);

  const confirm = () => {
    const choice = { sharePhone, syncContacts };
    void telegramConsentStore
      .getState()
      .decide(choice)
      .then(() => applyTelegramSync(choice));
  };

  const track = { false: colors.disabled, true: withAlpha(colors.accent, 0.55) };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={confirm}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.inputBackgroundSolid }]}>
          <View style={[styles.iconWrap, { backgroundColor: withAlpha(colors.accent, 0.14) }]}>
            <CapiIcon name="shield" size={26} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Telegram подключён</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Ваши диалоги Telegram видны в Capi. Сообщения Telegram не защищены сквозным
            шифрованием Capi. Что ещё разрешить?
          </Text>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                Номер Telegram в профиле Capi
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                Номер будет сохранён в вашем профиле на сервере.
              </Text>
            </View>
            <Switch
              value={sharePhone}
              onValueChange={setSharePhone}
              trackColor={track}
              thumbColor={sharePhone ? colors.accent : colors.iconMuted}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                Найти знакомых из контактов
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                Телефон запросит доступ к контактам, номера уйдут на сервер для поиска.
              </Text>
            </View>
            <Switch
              value={syncContacts}
              onValueChange={setSyncContacts}
              trackColor={track}
              thumbColor={syncContacts ? colors.accent : colors.iconMuted}
            />
          </View>

          <Pressable
            onPress={confirm}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.accent },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.buttonText, { color: colors.onAccent }]}>Продолжить</Text>
          </Pressable>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Оба пункта выключены по умолчанию.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: { borderRadius: 26, padding: 22 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 12, lineHeight: 17, marginTop: 2 },
  button: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  buttonPressed: { opacity: 0.88 },
  buttonText: { fontSize: 16, fontWeight: '800' },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 10 },
});
