const tailwindcssAnimate = require('tailwindcss-animate')
const typography = require('@tailwindcss/typography')
const defaultColors = require('tailwindcss/colors')

// Navy ink scale. Legacy components use blue/indigo utility classes; mapping those
// scales here re-skins them to the redesign palette without touching each file.
const ink = {
  50: '#F4F6FB',
  100: '#E8EDF7',
  200: '#CDD7EA',
  300: '#A2B0CD',
  400: '#6C7C9D',
  500: '#35466E',
  600: '#1A274D',
  700: '#0F1938',
  800: '#0A1129',
  900: '#070C1D',
  950: '#040711',
  DEFAULT: '#0F1938',
}

// Accent blue: the TOA Color World blue (sampled ~#001078 from the shop's signage), lifted lighter.
// 500 passes 4.5:1 on white; on navy (bg-ink) use 300 for text.
const signal = {
  50: '#F0F3FF',
  100: '#DCE4FE',
  200: '#BACAFC',
  300: '#8BA4F9',
  400: '#557AF1',
  500: '#2A54DF',
  600: '#1F45C1',
  700: '#1A3AA2',
  800: '#173082',
  900: '#132563',
  DEFAULT: '#2A54DF',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [
    tailwindcssAnimate,
    typography,
    function ({ addUtilities }) {
      addUtilities({
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      })
    },
  ],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        ink,
        signal,
        paper: '#F9FBFD',
        concrete: '#EBF1FA',
        hairline: '#D1DBEB',
        line: { DEFAULT: '#06C755', dark: '#05B34C' },
        blue: ink,
        indigo: ink,
        cyan: ink,
        sky: ink,
        gray: defaultColors.slate,
        // cool greys to sit with the navy palette; components still say "stone"
        stone: defaultColors.slate,
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-anuphan)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': '#334155',
              '--tw-prose-headings': '#0F1938',
              '--tw-prose-links': '#0F1938',
              '--tw-prose-bold': '#0F1938',
              h1: {
                fontWeight: '600',
                letterSpacing: '-0.03em',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}
