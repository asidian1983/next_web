import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        textile: {
          50: '#faf5f0',
          100: '#f3e8d8',
          200: '#e6cfb0',
          300: '#d4ae80',
          400: '#c08850',
          500: '#a96c38',
          600: '#8a5430',
          700: '#6e4028',
          800: '#5a3422',
          900: '#4a2c1e',
          950: '#2d1a11',
        },
        fabric: {
          50: '#f2f0f9',
          100: '#e8e4f5',
          200: '#d3ccec',
          300: '#b5a8de',
          400: '#9380cc',
          500: '#7a5fbd',
          600: '#6548a3',
          700: '#543a87',
          800: '#46326f',
          900: '#3a2b5c',
          950: '#23193a',
        },
      },
      backgroundImage: {
        'textile-pattern': "url('/textile-bg.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
