import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0d0d0d',
        'surface-2': '#141414',
        'surface-3': '#1a1a1a',
        border: '#1f1f1f',
        'border-bright': '#2d2d2d',
        purple: {
          DEFAULT: '#A855F7',
          50: '#f5f0ff',
          100: '#ede0ff',
          200: '#d9baff',
          300: '#bf8fff',
          400: '#a355f7',
          500: '#A855F7',
          600: '#7520c4',
          700: '#5e18a0',
          800: '#4a1280',
          900: '#370d60',
        },
        neon: {
          purple: '#A855F7',
          pink: '#ec4899',
          blue: '#3b82f6',
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #A855F7, 0 0 10px #A855F7' },
          '50%': { boxShadow: '0 0 20px #A855F7, 0 0 40px #A855F7, 0 0 60px rgba(168,85,247,0.4)' },
        },
        'slide-in': {
          from: { transform: 'translateX(-10px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(5px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-purple': '0 0 15px #A855F7, 0 0 30px rgba(168,85,247,0.5)',
        'neon-purple-sm': '0 0 8px #A855F7, 0 0 15px rgba(168,85,247,0.4)',
        'neon-green': '0 0 10px #22c55e, 0 0 20px rgba(34,197,94,0.3)',
        'neon-red': '0 0 10px #ef4444, 0 0 20px rgba(239,68,68,0.3)',
        'card': '0 0 0 1px #1f1f1f, 0 4px 20px rgba(0,0,0,0.8)',
        'card-hover': '0 0 0 1px #A855F7, 0 4px 30px rgba(168,85,247,0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(135deg, #A855F7, #5e18a0)',
        'gradient-purple-bright': 'linear-gradient(135deg, #a855f7, #A855F7)',
        'grid-pattern': "linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}

export default config
