import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../contexts/ThemeContext';
import { BRAND, BRAND_GRADIENT_END, BRAND_GRADIENT_START } from '../../theme/brand';
import { CapiIcon, type CapiIconName } from './CapiIcon';

type CapiPlateProps = {
  icon: CapiIconName;
  size?: number;
  radius?: number;
  iconSize?: number;
  /** Extra style for the outer container (e.g. margins). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Rounded icon plate used in lists, menus and quick actions.
 * Light theme: brand gradient with a white glyph. Dark theme: dark tile, violet border, gradient glyph.
 */
export const CapiPlate = React.memo(function CapiPlate({
  icon,
  size = 44,
  radius = 14,
  iconSize = 22,
  style,
}: CapiPlateProps) {
  const { resolvedScheme } = useTheme();

  if (resolvedScheme === 'dark') {
    return (
      <View
        style={[
          styles.center,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: BRAND.darkPlate,
            borderWidth: 1,
            borderColor: BRAND.darkPlateBorder,
          },
          style,
        ]}
      >
        <CapiIcon name={icon} size={iconSize} gradient />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[BRAND.gradient[0], BRAND.gradient[1]]}
      start={BRAND_GRADIENT_START}
      end={BRAND_GRADIENT_END}
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: radius,
          shadowColor: BRAND.lightPlateShadow,
          shadowOpacity: 0.28,
          shadowRadius: 7,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        style,
      ]}
    >
      <CapiIcon name={icon} size={iconSize} color="#FFFFFF" />
    </LinearGradient>
  );
});

type CapiGradientAvatarProps = {
  icon: CapiIconName;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
};

/** Gradient circle with a white glyph: avatar placeholder for channels (same in both themes). */
export const CapiGradientAvatar = React.memo(function CapiGradientAvatar({
  icon,
  size = 56,
  iconSize = 26,
  style,
}: CapiGradientAvatarProps) {
  return (
    <LinearGradient
      colors={[BRAND.gradient[0], BRAND.gradient[1]]}
      start={BRAND_GRADIENT_START}
      end={BRAND_GRADIENT_END}
      style={[styles.center, { width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <CapiIcon name={icon} size={iconSize} color="#FFFFFF" />
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
