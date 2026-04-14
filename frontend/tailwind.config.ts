import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: '#F5C800',
          dark: '#D4A800',
          light: '#FFD830',
        },
        navy: {
          DEFAULT: '#1A2B5E',
          light: '#243577',
          dark: '#111D3F',
        },
        muted: '#6B7A9E',
        offwhite: '#F7F6F2',
        light: '#EEF0F5',
      },
      fontFamily: {
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
