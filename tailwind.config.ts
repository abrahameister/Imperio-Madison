import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Design Tokens ── */
      colors: {
        bg: '#0B1722',
        surface: '#1A3B56',
        surface2: '#234B6E',
        text: '#EAF0FF',
        'text-muted': 'rgba(234,240,255,0.72)',
        border: 'rgba(234,240,255,0.14)',
        'accent-primary': '#E88632',
        'accent-secondary': '#86AB45',
        danger: '#FF5A6B',
        warning: '#FFCC66',
        'comp-lider': '#0071CE',
        'comp-jumbo': '#00A44F',
        'comp-tottus': '#E31837',
      },

      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        pill: '9999px',
      },

      boxShadow: {
        sm: '0 4px 12px rgba(0,0,0,0.10)',
        md: '0 8px 24px rgba(0,0,0,0.20)',
        glow: '0 0 16px 2px #86AB4566',
        'glow-orange': '0 0 16px 2px #E8863244',
        'focus-ring': '0 0 0 3px #E8863222',
      },

      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },

      /* ── Keyframes ── */
      keyframes: {
        'ping-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.55)', opacity: '0' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      animation: {
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide-down': 'slide-down 0.22s ease-out both',
        'fade-in': 'fade-in 0.25s ease both',
        'badge-pop': 'badge-pop 0.3s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
