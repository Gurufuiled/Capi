import { StyleSheet } from 'react-native';

import { CHAT_LIST_MENU_WIDTH } from '../presentation';
import type { ResolvedColorScheme, ThemeColors } from '../theme/palettes';
import { withAlpha } from '../theme/stylePrimitives';

const DANGER = '#E5484D';

export function createChatListActionsMenuStyles(
  c: ThemeColors,
  scheme: ResolvedColorScheme = 'light',
) {
  const dark = scheme === 'dark';
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: dark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(18, 24, 38, 0.22)',
    },
    /** Floating panel with three round actions (Capi: pin, mute, delete). */
    menuCard: {
      position: 'absolute',
      width: CHAT_LIST_MENU_WIDTH,
      flexDirection: 'row',
      borderRadius: 22,
      paddingVertical: 8,
      paddingHorizontal: 6,
      backgroundColor: c.inputBackgroundSolid,
      shadowColor: '#3C1E82',
      shadowOpacity: dark ? 0.4 : 0.24,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    action: {
      flex: 1,
      alignItems: 'center',
      gap: 5,
      borderRadius: 16,
      paddingVertical: 2,
    },
    actionPressed: {
      backgroundColor: c.rowPressed,
    },
    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(c.accent, dark ? 0.18 : 0.1),
    },
    iconWrapDanger: {
      backgroundColor: withAlpha(DANGER, dark ? 0.2 : 0.12),
    },
    actionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: c.textPrimary,
    },
    actionLabelDanger: {
      color: DANGER,
    },
  });
}

export type ChatListActionsMenuStyleSet = ReturnType<
  typeof createChatListActionsMenuStyles
>;
