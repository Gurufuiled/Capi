/**
 * Semantic color tokens shared by light and dark palettes (same keys).
 * Capi: violet accent on cool neutrals; the violet → cyan brand gradient lives in `brand.ts`.
 */

export type ThemeColors = {
  textPrimary: string;
  textSecondary: string;
  textSecondaryMuted: string;
  placeholder: string;
  accent: string;
  /** Текст и иконки на сплошной заливке `accent` (в тёмной теме акцент светлый, поэтому текст тёмный). */
  onAccent: string;
  link: string;
  disabled: string;
  separator: string;
  chatBackground: string;
  inputBackground: string;
  inputBackgroundSolid: string;
  buttonBackground: string;
  header: string;
  toolbar: string;
  bubbleMe: string;
  bubbleOther: string;
  bubbleOtherBorder: string;
  placeholderBg: string;
  iconMuted: string;
  composerBorder: string;
  composerSurface: string;
  rowPressed: string;
};

export type AppAppearancePreference = 'system' | 'light' | 'dark';

export type ResolvedColorScheme = 'light' | 'dark';

/** Capi light palette (legacy `colors` export). */
export const lightPalette: ThemeColors = {
  textPrimary: '#121826',
  textSecondary: '#6B7685',
  textSecondaryMuted: 'rgba(18,24,38,0.42)',
  placeholder: '#9AA3B2',
  accent: '#6D3FE0',
  onAccent: '#FFFFFF',
  link: '#6D3FE0',
  disabled: '#C9CCD6',
  separator: '#EDEBF5',
  chatBackground: '#F7F6FC',
  inputBackground: '#EEEAF8',
  inputBackgroundSolid: '#FFFFFF',
  buttonBackground: '#ECEAF6',
  header: '#FFFFFF',
  toolbar: '#FFFFFF',
  bubbleMe: '#7B4DF0',
  bubbleOther: '#FFFFFF',
  bubbleOtherBorder: '#E4E0F1',
  placeholderBg: '#E4E0F1',
  iconMuted: '#9A93B5',
  composerBorder: '#E1DCF0',
  composerSurface: '#FFFFFF',
  rowPressed: '#F1EEFA',
};

/** Capi dark palette: deep violet-black surfaces, lighter violet accent. */
export const darkPalette: ThemeColors = {
  textPrimary: '#F2F2F7',
  textSecondary: '#9A9AB0',
  textSecondaryMuted: 'rgba(242,242,247,0.72)',
  placeholder: '#6F6F8A',
  accent: '#A78BFA',
  onAccent: '#12121A',
  link: '#B7A2FB',
  disabled: '#4A4A5E',
  separator: 'rgba(255,255,255,0.08)',
  chatBackground: '#12121A',
  inputBackground: '#1B1B28',
  inputBackgroundSolid: '#1B1B28',
  buttonBackground: '#232336',
  header: '#171722',
  toolbar: '#171722',
  bubbleMe: '#6D3FE0',
  bubbleOther: '#232336',
  bubbleOtherBorder: 'rgba(255,255,255,0.10)',
  placeholderBg: '#2C2C42',
  iconMuted: '#8A8AA6',
  composerBorder: 'rgba(255,255,255,0.12)',
  composerSurface: '#1B1B28',
  rowPressed: 'rgba(255,255,255,0.06)',
};

export function getPaletteForScheme(scheme: ResolvedColorScheme): ThemeColors {
  return scheme === 'dark' ? darkPalette : lightPalette;
}
