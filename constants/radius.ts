/**
 * iLogMo Design System - Border Radius Tokens
 * Distinctive rounded UI (Cards: 24px) reflecting modern Apple & Linear aesthetics.
 */

export const radius = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24, // Core Card & Container radius (24px)
  '3xl': 28,
  '4xl': 32,
  card: 24, // Standard card radius
  button: 16, // Standard button radius
  badge: 9999,
  full: 9999,
} as const;

export type Radius = typeof radius;
