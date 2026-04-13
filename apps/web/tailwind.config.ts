import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#bbf7d0',
          DEFAULT: '#4ade80',
          dark: '#16a34a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
