import { StyleSheet } from 'react-native';

import type { ThemeColors } from '../theme/palettes';

/** Capi V3 settings: flat list without cards, account block with a camera badge on the avatar. */
export function createSettingsScreenStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.chatBackground },
    scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 48 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.chatBackground },
    errorBox: {
      backgroundColor: '#ffebee',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    errorText: { color: '#c62828', fontSize: 14 },

    account: { alignItems: 'center', paddingTop: 4, paddingBottom: 6 },
    avatarWrap: { width: 76, height: 76, marginBottom: 8 },
    avatar: { width: 76, height: 76, borderRadius: 38 },
    avatarPlaceholder: {
      width: 76,
      height: 76,
      borderRadius: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarPlaceholderText: { color: '#FFFFFF', fontSize: 32, fontWeight: '700' },
    avatarOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 38,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraBadge: {
      position: 'absolute',
      right: -4,
      bottom: -4,
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 3,
      borderColor: c.chatBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { fontSize: 19, fontWeight: '600', color: c.textPrimary, textAlign: 'center' },
    meta: { marginTop: 2, fontSize: 13, color: c.textSecondary, textAlign: 'center' },
    changePhotoLink: { marginTop: 6, paddingVertical: 4, paddingHorizontal: 8 },
    changePhotoText: { fontSize: 15, fontWeight: '600', color: c.accent },

    groupLabel: {
      paddingTop: 14,
      paddingLeft: 4,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      color: c.textSecondary,
    },
    group: { marginTop: 2 },

    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      height: 50,
      marginTop: 14,
      paddingHorizontal: 4,
    },
    logoutText: { fontSize: 16, fontWeight: '600' },
    version: { marginTop: 4, textAlign: 'center', fontSize: 12, color: c.textSecondary },
  });
}
