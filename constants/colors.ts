/**
 * iLogMo Design System - Color Palette
 * Modern, Minimal, Apple/Linear-inspired aesthetic.
 * Primary: #2563EB | Background: #F8FAFC | Card: #FFFFFF
 */

export const colors = {
  // Brand / Primary
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB', // Core Brand Primary
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
    DEFAULT: '#2563EB',
  },

  // Neutrals / Gray
  neutral: {
    50: '#fafafa', // Core App Background
    100: '#f5f5f5',
    200: '#e5e5e5', // Core Border / Separator
    300: '#d4d4d4',
    400: '#a3a3a3', // Placeholder / Muted
    500: '#737373', // Secondary Text
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717', // Primary Headings & Dark Text
    950: '#0a0a0a',
  },

  // Surfaces & Backgrounds
  background: {
    app: '#fafafa',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    subtle: '#f5f5f5',
    elevated: '#FFFFFF',
    overlay: 'rgba(15, 23, 42, 0.4)',
    glass: 'rgba(255, 255, 255, 0.85)',
  },

  // Semantic / Feedback
  success: {
    light: '#ECFDF5',
    DEFAULT: '#10B981',
    dark: '#047857',
    text: '#065F46',
  },
  warning: {
    light: '#FFFBEB',
    DEFAULT: '#F59E0B',
    dark: '#B45309',
    text: '#92400E',
  },
  error: {
    light: '#FEF2F2',
    DEFAULT: '#EF4444',
    dark: '#B91C1C',
    text: '#991B1B',
  },
  info: {
    light: '#EFF6FF',
    DEFAULT: '#3B82F6',
    dark: '#1D4ED8',
    text: '#1E40AF',
  },

  // Text Tokens
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
    brand: '#2563EB',
  },

  // Borders & Dividers
  border: {
    light: '#F1F5F9',
    DEFAULT: '#E2E8F0',
    strong: '#CBD5E1',
    focus: '#2563EB',
  },
} as const;

export type Colors = typeof colors;
