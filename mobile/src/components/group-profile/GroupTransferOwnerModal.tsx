import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { withAlpha } from '../../theme/stylePrimitives';
import { CapiIcon } from '../capi/CapiIcon';

export type TransferOwnerCandidate = { id: string; name: string };

type Props = {
  visible: boolean;
  admins: TransferOwnerCandidate[];
  onPick: (userId: string) => void;
  onClose: () => void;
};

/** Владелец выбирает администратора, которому передаёт группу перед выходом. */
export function GroupTransferOwnerModal({ visible, admins, onPick, onClose }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { backgroundColor: colors.inputBackgroundSolid }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Кому передать группу?</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Новый владелец получит все права. Вы выйдете из группы.
          </Text>
          <ScrollView style={styles.list}>
            {admins.map((admin) => (
              <Pressable
                key={admin.id}
                onPress={() => onPick(admin.id)}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.rowPressed }]}
              >
                <View style={[styles.icon, { backgroundColor: withAlpha(colors.accent, 0.14) }]}>
                  <CapiIcon name="user" size={20} color={colors.accent} />
                </View>
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                  {admin.name}
                </Text>
                <CapiIcon name="chevronRight" size={18} color={colors.iconMuted} />
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: colors.accent }]}>Отмена</Text>
          </Pressable>
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
  card: { borderRadius: 24, padding: 18, maxHeight: '70%' },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 13, lineHeight: 18, textAlign: 'center', marginTop: 6, marginBottom: 10 },
  list: { flexGrow: 0 },
  row: {
    minHeight: 56,
    borderRadius: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  name: { flex: 1, fontSize: 15, fontWeight: '700' },
  cancel: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  cancelText: { fontSize: 15, fontWeight: '800' },
});
