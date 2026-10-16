import React from 'react';
import { CapiIcon, type CapiIconName } from './capi/CapiIcon';
import { colors } from '../theme/colors';

export type ProfileActionIconName = 'call' | 'video' | 'sound' | 'search' | 'more';

type ProfileActionIconProps = {
  name: ProfileActionIconName;
  size?: number;
  color?: string;
  active?: boolean;
  /** Draw the glyph with the brand gradient line (dark theme tiles). */
  gradient?: boolean;
};

const GLYPH: Record<ProfileActionIconName, CapiIconName> = {
  call: 'phone',
  video: 'video',
  sound: 'bell',
  search: 'search',
  more: 'more',
};

/**
 * Quick actions в шапке профиля: линейные иконки Capi (сетка 24, линия 1.8).
 */
export function ProfileActionIcon({
  name,
  size = 20,
  color = colors.accent,
  active = false,
  gradient = false,
}: ProfileActionIconProps) {
  const glyph: CapiIconName = name === 'sound' && active ? 'bellOff' : GLYPH[name];
  return <CapiIcon name={glyph} size={size} color={color} gradient={gradient} />;
}
