import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  canvas: '#F8F5EF',
  surface: '#FFFCF7',
  ink: '#10231D',
  muted: '#69706D',
  forest: '#14362A',
  forestSoft: '#285044',
  sand: '#EBD9BD',
  gold: '#B98942',
  white: '#FFFFFF',
  black: '#07100D',
  line: '#E8E1D7',
  overlay: 'rgba(5,20,15,0.58)',
  softOverlay: 'rgba(5,20,15,0.20)',
  transparent: 'transparent',
  danger: '#B94B42',
} as const;

export const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
} as const;

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;

export const typography = {
  display: { fontFamily: 'Georgia', fontSize: 42, lineHeight: 47, fontWeight: '700' },
  title: { fontFamily: 'Georgia', fontSize: 25, lineHeight: 31, fontWeight: '700' },
  cardTitle: { fontFamily: 'Georgia', fontSize: 22, lineHeight: 27, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23 },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16 },
} as const satisfies Record<string, TextStyle>;

export const shadows = {
  soft: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  floating: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
} as const satisfies Record<string, ViewStyle>;

export const animations = {
  fast: 160,
  standard: 280,
  slow: 520,
  pressScale: 0.97,
} as const;

export const theme = { colors, spacing, radius, typography, shadows, animations } as const;
