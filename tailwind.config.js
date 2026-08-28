/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
          DEFAULT: '#2563EB',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        background: {
          DEFAULT: '#fafafa',
          app: '#fafafa',
          card: '#FFFFFF',
          surface: '#FFFFFF',
          subtle: '#f5f5f5',
        },
        card: {
          DEFAULT: '#FFFFFF',
        },
      },
      borderRadius: {
        card: '24px',
        button: '16px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
      },
      spacing: {
        4.5: '18px',
        18: '72px',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
        medium: ['Inter_500Medium', 'sans-serif'],
        semibold: ['Inter_600SemiBold', 'sans-serif'],
        bold: ['Inter_700Bold', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(15, 23, 42, 0.04)',
        'soft-md': '0 4px 12px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 10px 24px rgba(15, 23, 42, 0.08)',
        card: '0 6px 16px rgba(30, 41, 59, 0.05)',
      },
    },
  },
  plugins: [],
};
