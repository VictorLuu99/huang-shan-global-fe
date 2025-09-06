import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Huangshan Color System
        primary: {
          50: '#f0f7f2',      // Lightest sage
          100: '#dbeee1',     // Light sage
          500: '#2d5a3d',     // Primary brand green
          600: '#234a32',     // Darker green
          700: '#1a3a27',     // Deep green
          800: '#122a1d',     // Very deep green
          900: '#0a1a12',     // Darkest green
        },
        sage: {
          50: '#f7f8f7',      // Background sage
          100: '#eef0ed',     // Light sage
          400: '#a8b5a4',     // Medium sage
          500: '#8a9487',     // Primary sage
        },
        secondary: {
          500: '#4a7c59',     // Secondary green
        },
        accent: {
          500: '#6b9b7a',     // Accent green
        },
        // Modern design system colors mapped to Huangshan theme
        background: '#f7f8f7',           // sage-50
        foreground: '#0a1a12',           // primary-900
        card: '#ffffff',
        'card-foreground': '#0a1a12',    // primary-900
        popover: '#ffffff',
        'popover-foreground': '#0a1a12', // primary-900
        muted: '#eef0ed',                // sage-100
        'muted-foreground': '#8a9487',   // sage-500
        border: '#dbeee1',               // primary-100
        input: '#dbeee1',                // primary-100
        ring: '#2d5a3d',                 // primary-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;