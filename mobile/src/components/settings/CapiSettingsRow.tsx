import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { BRAND } from '../../theme/brand';
import type { ThemeColors } from '../../theme/palettes';
import { CapiIcon, type CapiIconName } from '../capi/CapiIcon';

export type CapiSettingsRowProps = {
  icon: CapiIconName;
  title: string;
  subtitle?: string;
  /** Section is not connected yet: dimmed row with a quiet «Скоро» label. */
  soon?: boolean;
  /** Small status pill on the right (e.g. «В сети»). */
  badge?: { label: string; bg: string; text: string };
  destructive?: boolean;
  showChevron?: boolean;
  /** First row of a group has no top divider. */
  first?: boolean;
  onPress?: () => void;
  testID?: string;
};

/**
 * Flat settings row (Capi V3): accent line icon, title, optional subtitle, hairline divider.
 */
export function CapiSettingsRow({
  icon,
  title,
  subtitle,
  soon = false,
  badge,
  destructive = false,
  showChevron = true,
  first = false,
  onPress,
  testID,
}: CapiSettingsRowProps) {
  const { colors, resolvedScheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const danger = BRAND.danger[resolvedScheme];
  const iconColor = destructive ? danger : colors.accent;
  const titleColor = destructive ? danger : soon ? colors.textSecondary : colors.textPrimary;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.row,
        !first && styles.rowDivider,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.iconSlot, soon && styles.iconSoon]}>
        <CapiIcon name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
        </View>
      ) : null}
      {soon ? <Text style={styles.soonText}>Скоро</Text> : null}
      {showChevron ? <CapiIcon name="chevronRight" size={18} color={colors.iconMuted} /> : null}
    </Pressable>
  );
}

function createStyles(c: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 58,
      paddingVertical: 11,
    },
    rowDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.separator,
    },
    rowPressed: { opacity: 0.7 },
    iconSlot: {
      width: 28,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconSoon: { opacity: 0.5 },
    textBlock: { flex: 1, minWidth: 0, gap: 1 },
    title: { fontSize: 16, fontWeight: '600' },
    subtitle: { fontSize: 13, lineHeight: 17, color: c.textSecondary },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    badgeText: { fontSize: 12, fontWeight: '600' },
    soonText: { fontSize: 12, color: c.textSecondary },
  });
}
