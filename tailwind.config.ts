import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'text-primary': 'hsl(var(--text) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        stroke: 'hsl(var(--stroke) / <alpha-value>)',
      },
      fontFamily: {
        body: ['Inter', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', '"Noto Sans TC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
