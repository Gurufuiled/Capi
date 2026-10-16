import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { BRAND } from '../../theme/brand';

type RectDef = { x: number; y: number; width: number; height: number; rx?: number };
type CircleDef = { cx: number; cy: number; r: number };

type IconDef = {
  paths?: string[];
  circles?: CircleDef[];
  rects?: RectDef[];
};

/**
 * Capi line icons: 24×24 grid, round caps and joins (see design/ in the CapiChat repo).
 * Files for the same set live in assets/icons/{profile,chat,settings}.
 */
const ICONS = {
  phone: {
    paths: [
      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    ],
  },
  video: {
    paths: ['m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5'],
    rects: [{ x: 2, y: 6, width: 14, height: 12, rx: 2 }],
  },
  bell: {
    paths: [
      'M10.268 21a2 2 0 0 0 3.464 0',
      'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
    ],
  },
  bellOff: {
    paths: [
      'M10.268 21a2 2 0 0 0 3.464 0',
      'M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742',
      'm2 2 20 20',
      'M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05',
    ],
  },
  search: {
    paths: ['m21 21-4.34-4.34'],
    circles: [{ cx: 11, cy: 11, r: 8 }],
  },
  more: {
    circles: [
      { cx: 12, cy: 12, r: 1 },
      { cx: 19, cy: 12, r: 1 },
      { cx: 5, cy: 12, r: 1 },
    ],
  },
  atSign: {
    paths: ['M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8'],
    circles: [{ cx: 12, cy: 12, r: 4 }],
  },
  copy: {
    paths: ['M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'],
    rects: [{ x: 8, y: 8, width: 14, height: 14, rx: 2 }],
  },
  users: {
    paths: [
      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
      'M23 21v-2a4 4 0 0 0-3-3.87',
      'M16 3.13a4 4 0 0 1 0 7.75',
    ],
    circles: [{ cx: 9, cy: 7, r: 4 }],
  },
  userPlus: {
    paths: ['M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M20 8v6', 'M23 11h-6'],
    circles: [{ cx: 8.5, cy: 7, r: 4 }],
  },
  user: {
    paths: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
    circles: [{ cx: 12, cy: 7, r: 4 }],
  },
  megaphone: {
    paths: ['m3 11 18-5v12L3 14v-3z', 'M11.6 16.8a3 3 0 1 1-5.8-1.6'],
  },
  camera: {
    paths: [
      'M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z',
    ],
    circles: [{ cx: 12, cy: 13, r: 3 }],
  },
  chevronRight: { paths: ['m9 18 6-6-6-6'] },
  chevronLeft: { paths: ['m15 18-6-6 6-6'] },
  x: { paths: ['M18 6 6 18', 'm6 6 12 12'] },
  check: { paths: ['M20 6 9 17l-5-5'] },
  send: {
    paths: [
      'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
      'm21.854 2.147-10.94 10.939',
    ],
  },
  grid: {
    rects: [
      { x: 3, y: 3, width: 7, height: 7, rx: 1 },
      { x: 14, y: 3, width: 7, height: 7, rx: 1 },
      { x: 14, y: 14, width: 7, height: 7, rx: 1 },
      { x: 3, y: 14, width: 7, height: 7, rx: 1 },
    ],
  },
  palette: {
    paths: [
      'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z',
    ],
    circles: [
      { cx: 13.5, cy: 6.5, r: 0.5 },
      { cx: 17.5, cy: 10.5, r: 0.5 },
      { cx: 6.5, cy: 12.5, r: 0.5 },
      { cx: 8.5, cy: 7.5, r: 0.5 },
    ],
  },
  messageSquare: {
    paths: [
      'M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z',
    ],
  },
  messageCircle: { paths: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'] },
  circleUser: {
    paths: ['M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662'],
    circles: [
      { cx: 12, cy: 12, r: 10 },
      { cx: 12, cy: 10, r: 3 },
    ],
  },
  globe: {
    paths: ['M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20'],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  chartPie: {
    paths: [
      'M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z',
      'M21.21 15.89A10 10 0 1 1 8 2.83',
    ],
  },
  shield: {
    paths: [
      'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    ],
  },
  lock: {
    paths: ['M7 11V7a5 5 0 0 1 10 0v4'],
    rects: [{ x: 3, y: 11, width: 18, height: 11, rx: 2 }],
  },
  laptop: {
    paths: [
      'M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z',
      'M20.054 15.987H3.946',
    ],
  },
  bug: {
    paths: [
      'm8 2 1.88 1.88',
      'M14.12 3.88 16 2',
      'M9 7.13v-1a3.003 3.003 0 1 1 6 0v1',
      'M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6',
      'M12 20v-9',
      'M6.53 9C4.6 8.8 3 7.1 3 5',
      'M6 13H2',
      'M3 21c0-2.1 1.7-3.9 3.8-4',
      'M20.97 5c0 2.1-1.6 3.8-3.5 4',
      'M22 13h-4',
      'M17.2 17c2.1.1 3.8 1.9 3.8 4',
    ],
  },
  lightbulb: {
    paths: [
      'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
      'M9 18h6',
      'M10 22h4',
    ],
  },
  logOut: {
    paths: ['m16 17 5-5-5-5', 'M21 12H9', 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'],
  },
  settings: {
    paths: [
      'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    ],
    circles: [{ cx: 12, cy: 12, r: 3 }],
  },
  mic: {
    paths: ['M12 19v3', 'M19 10v2a7 7 0 0 1-14 0v-2'],
    rects: [{ x: 9, y: 2, width: 6, height: 13, rx: 3 }],
  },
  trash: {
    paths: [
      'M3 6h18',
      'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
      'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
      'M10 11v6',
      'M14 11v6',
    ],
  },
  ban: {
    paths: ['m4.9 4.9 14.2 14.2'],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  pin: {
    paths: [
      'M12 17v5',
      'M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
    ],
  },
  pinOff: {
    paths: [
      'M12 17v5',
      'M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89',
      'm2 2 20 20',
      'M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11',
    ],
  },
  volume: {
    paths: [
      'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z',
      'M16 9a5 5 0 0 1 0 6',
      'M19.364 18.364a9 9 0 0 0 0-12.728',
    ],
  },
} satisfies Record<string, IconDef>;

export type CapiIconName = keyof typeof ICONS;

type CapiIconProps = {
  name: CapiIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Draw the line with the brand gradient (violet → blue-cyan) instead of `color`. */
  gradient?: boolean;
};

const GRADIENT_ID = 'capiIconGradient';

export const CapiIcon = React.memo(function CapiIcon({
  name,
  size = 22,
  color = '#000000',
  strokeWidth = 1.8,
  gradient = false,
}: CapiIconProps) {
  const def: IconDef = ICONS[name];
  const stroke = gradient ? `url(#${GRADIENT_ID})` : color;
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {gradient ? (
        <Defs>
          {/* userSpaceOnUse: with objectBoundingBox straight horizontal/vertical lines (e.g. a plus) are not painted. */}
          <LinearGradient
            id={GRADIENT_ID}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
          >
            <Stop offset="0" stopColor={BRAND.gradientOnDark[0]} />
            <Stop offset="1" stopColor={BRAND.gradientOnDark[1]} />
          </LinearGradient>
        </Defs>
      ) : null}
      {def.paths?.map((d, i) => <Path key={`p${i}`} d={d} {...common} />)}
      {def.rects?.map((r, i) => (
        <Rect key={`r${i}`} x={r.x} y={r.y} width={r.width} height={r.height} rx={r.rx} {...common} />
      ))}
      {def.circles?.map((c, i) => <Circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} {...common} />)}
    </Svg>
  );
});
