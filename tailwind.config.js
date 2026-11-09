/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        roblox: {
          dark: '#0a0b0e',
          card: '#13151b',
          cardBorder: '#232733',
          accent: '#00A2FF',
          accentHover: '#0084d1',
          gold: '#FFB800',
          emerald: '#10B981',
          ruby: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 162, 255, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 162, 255, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
