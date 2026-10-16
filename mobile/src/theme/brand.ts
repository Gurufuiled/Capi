/**
 * Capi brand constants: the violet → cyan gradient and the few semantic colors
 * used by the redesigned screens (see design/ in the CapiChat repo).
 */

export const BRAND = {
  /** Gradient for plates, avatars and primary surfaces (light theme and avatars). */
  gradient: ['#8B5CFF', '#22D3EE'] as const,
  /** Lighter stops for thin gradient lines drawn on dark surfaces. */
  gradientOnDark: ['#A78BFA', '#38BDF8'] as const,
  /** Dark tile used behind gradient glyphs in dark theme. */
  darkPlate: '#1F1F2E',
  darkPlateBorder: 'rgba(139, 92, 255, 0.38)',
  darkPlateGlow: '#8B5CFF',
  /** Light theme plate shadow. */
  lightPlateShadow: '#6366F1',
  /** Semantic colors (kept out of the accent system on purpose). */
  danger: { light: '#E5484D', dark: '#FF6B70' },
  online: {
    light: { bg: '#DDF3E5', text: '#15803D' },
    dark: { bg: '#16301F', text: '#4ADE80' },
  },
} as const;

export const BRAND_GRADIENT_START = { x: 0, y: 0 } as const;
export const BRAND_GRADIENT_END = { x: 1, y: 1 } as const;
