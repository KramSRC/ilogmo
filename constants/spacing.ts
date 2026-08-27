/**
 * iLogMo Design System - 8-Point Spacing Grid
 * Harmonious spacing scale for consistent layouts, padding, and margins.
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4, // 0.5 unit
  sm: 8, // 1 unit (Base grid)
  md: 16, // 2 units
  lg: 24, // 3 units
  xl: 32, // 4 units
  '2xl': 40, // 5 units
  '3xl': 48, // 6 units
  '4xl': 56, // 7 units
  '5xl': 64, // 8 units
  '6xl': 80, // 10 units
} as const;

export type Spacing = typeof spacing;
