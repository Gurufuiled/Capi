import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { Chat } from '../stores/types';
import { useTheme } from '../contexts/ThemeContext';
import { CapiIcon, type CapiIconName } from './capi/CapiIcon';
import {
  createChatListActionsMenuStyles,
  type ChatListActionsMenuStyleSet,
} from './chatListActionsMenu.styles';

export type ChatListMenuState = {
  chatId: string;
  top: number;
  left: number;
} | null;

type ChatListActionsMenuProps = {
  visible: boolean;
  menuState: ChatListMenuState;
  isMuted: boolean;
  isPinned: boolean;
  onClose: () => void;
  onToggleMute: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
};

const DANGER = '#E5484D';

function MenuAction({
  label,
  icon,
  danger = false,
  onPress,
  styles,
  accent,
}: {
  label: string;
  icon: CapiIconName;
  danger?: boolean;
  onPress: () => void;
  styles: ChatListActionsMenuStyleSet;
  accent: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
    >
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        <CapiIcon name={icon} size={20} color={danger ? DANGER : accent} />
      </View>
      <Text
        style={[styles.actionLabel, danger && styles.actionLabelDanger]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const ChatListActionsMenu = React.memo(function ChatListActionsMenu({
  visible,
  menuState,
  isMuted,
  isPinned,
  onClose,
  onToggleMute,
  onTogglePin,
  onDelete,
}: ChatListActionsMenuProps) {
  const { colors: themeColors, resolvedScheme } = useTheme();
  const styles = useMemo(
    () => createChatListActionsMenuStyles(themeColors, resolvedScheme),
    [themeColors, resolvedScheme],
  );

  if (!visible || !menuState) return null;

  const muteLabel = isMuted ? 'Со звуком' : 'Без звука';
  const pinLabel = isPinned ? 'Открепить' : 'Закрепить';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.menuCard,
            {
              top: menuState.top,
              left: menuState.left,
            },
          ]}
        >
          <MenuAction
            label={pinLabel}
            icon={isPinned ? 'pinOff' : 'pin'}
            onPress={onTogglePin}
            styles={styles}
            accent={themeColors.accent}
          />
          <MenuAction
            label={muteLabel}
            icon={isMuted ? 'bell' : 'bellOff'}
            onPress={onToggleMute}
            styles={styles}
            accent={themeColors.accent}
          />
          <MenuAction
            label="Удалить"
            icon="trash"
            danger
            onPress={onDelete}
            styles={styles}
            accent={themeColors.accent}
          />
        </View>
      </View>
    </Modal>
  );
});
