import { StyleSheet } from 'react-native';

import type { ThemeColors } from '../theme/palettes';
import { BRAND } from '../theme/brand';
import { withAlpha } from '../theme/stylePrimitives';

const HERO_COLLAPSED_SIZE = 108;

export function createChatProfileHeroStyles(c: ThemeColors) {
  return StyleSheet.create({
    heroCard: {
      alignItems: 'center',
      paddingTop: 24,
      paddingBottom: 18,
      backgroundColor: c.chatBackground,
      overflow: 'hidden',
    },
    topBar: {
      width: '100%',
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      marginBottom: 2,
    },
    navBubble: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(c.inputBackgroundSolid, 0.88),
    },
    editBubble: {
      minWidth: 68,
      height: 44,
      paddingHorizontal: 16,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(c.inputBackgroundSolid, 0.92),
    },
    editBubbleText: {
      fontSize: 17,
      lineHeight: 20,
      fontWeight: '700',
      color: c.textPrimary,
    },
    bubblePressed: {
      opacity: 0.72,
      transform: [{ scale: 0.98 }],
    },
    avatarPressable: {
      width: '100%',
      alignItems: 'center',
    },
    avatarPressablePressed: {
      opacity: 0.96,
    },
    avatarFrame: {
      width: HERO_COLLAPSED_SIZE,
      height: HERO_COLLAPSED_SIZE,
      borderRadius: 54,
      marginBottom: 14,
      overflow: 'hidden',
      backgroundColor: withAlpha(c.accent, 0.12),
      borderWidth: 3,
      borderColor: withAlpha(c.inputBackgroundSolid, 0.5),
    },
    avatarMedia: {
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarFallbackText: {
      fontSize: 40,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    heroContent: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    name: {
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '700',
      color: c.textPrimary,
      textAlign: 'center',
    },
    status: {
      marginTop: 4,
      fontSize: 16,
      color: c.textSecondary,
      textAlign: 'center',
    },
    handle: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: '600',
      color: c.accent,
      textAlign: 'center',
    },
    quickActionsRow: {
      marginTop: 20,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8,
    },
    /** Capi: square tile with the label underneath (tile styles below). */
    quickAction: {
      flex: 1,
      alignItems: 'center',
      gap: 7,
    },
    quickActionPressed: {
      opacity: 0.86,
    },
    quickActionTile: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 18,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionTileLight: {
      shadowColor: BRAND.lightPlateShadow,
      shadowOpacity: 0.3,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    quickActionTileDark: {
      backgroundColor: BRAND.darkPlate,
      borderWidth: 1,
      borderColor: BRAND.darkPlateBorder,
    },
    quickActionLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: c.textPrimary,
      textAlign: 'center',
    },
    quickActionWave: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: withAlpha('#FFFFFF', 0.18),
    },
    loaderRow: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loaderText: {
      fontSize: 14,
      color: c.textSecondary,
    },
    errorText: {
      marginTop: 16,
      fontSize: 14,
      textAlign: 'center',
      color: '#E05263',
    },
  });
}

export type ChatProfileHeroStyleSet = ReturnType<typeof createChatProfileHeroStyles>;
