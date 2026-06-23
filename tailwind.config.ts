import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f3eeff',
          100: '#e4d4ff',
          200: '#c9aaff',
          300: '#a87aff',
          400: '#8b52f5',
          500: '#7B2FF7',
          600: '#6320d4',
          700: '#4e18a8',
          800: '#3a1280',
          900: '#260c58',
          950: '#130630',
        },
        cyan: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        surface: {
          950: '#04040d',
          900: '#07071a',
          800: '#0c0c20',
          700: '#111128',
          600: '#171730',
          500: '#1e1e3c',
          400: '#27274a',
          300: '#323260',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7B2FF7 0%, #4f46e5 50%, #06b6d4 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, rgba(123,47,247,0.15) 0%, rgba(6,182,212,0.08) 100%)',
        'gradient-text': 'linear-gradient(90deg, #7B2FF7 0%, #a855f7 40%, #06b6d4 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(123,47,247,0.08) 0%, rgba(6,182,212,0.04) 100%)',
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out both',
        'slide-up':  'slideUp 0.5s ease-out both',
        'slide-down':'slideDown 0.3s ease-out both',
        'scale-in':  'scaleIn 0.25s ease-out both',
        'shimmer':   'shimmer 2s linear infinite',
        'pulse-slow':'pulse 4s ease-in-out infinite',
        'glow':      'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(123,47,247,0.25), 0 0 40px rgba(6,182,212,0.1)' },
          '50%':      { boxShadow: '0 0 35px rgba(123,47,247,0.45), 0 0 70px rgba(6,182,212,0.2)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
