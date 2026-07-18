/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: 'rgb(var(--color-bg-950) / <alpha-value>)',
          900: 'rgb(var(--color-bg-900) / <alpha-value>)',
          800: 'rgb(var(--color-bg-800) / <alpha-value>)',
          700: 'rgb(var(--color-bg-700) / <alpha-value>)',
          600: 'rgb(var(--color-bg-600) / <alpha-value>)',
        },
        white: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        onAccent: 'rgb(var(--color-on-accent) / <alpha-value>)',
        electric: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          400: 'rgb(var(--color-accent) / 0.85)',
          500: 'rgb(var(--color-accent) / <alpha-value>)',
          600: 'rgb(var(--color-accent) / 1)',
          glow: 'rgb(var(--color-accent) / 0.35)',
        },
        success: '#3FAE68',
        warning: '#D99A3D',
        danger: '#C0435B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        glow: '0 0 24px rgb(var(--color-accent) / 0.25)',
        card: '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
