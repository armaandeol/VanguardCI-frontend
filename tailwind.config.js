/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        oled: {
          bg: "#000000",
          surface: "#050505",
          card: "#0b0b0b",
          cardLight: "#121212",
          border: "#181818",
          borderGlow: "#22c55e",
          textMuted: "#8e8e8e",
        },
        brand: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e", // Main green
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            glow: "#39ff14", // Neon Matrix green
            emerald: "#10b981",
          }
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(34, 197, 94, 0.12)',
        'glow-strong': '0 0 25px rgba(34, 197, 94, 0.25)',
        'glow-neon': '0 0 20px rgba(57, 255, 20, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'border-beam': 'border-beam 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)', filter: 'drop-shadow(0 0 2px rgba(34, 197, 94, 0.4))' },
          '50%': { opacity: '1', transform: 'scale(1.05)', filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.8))' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'border-beam': {
          '0%': { 'border-color': 'rgba(34, 197, 94, 0.2)' },
          '50%': { 'border-color': 'rgba(34, 197, 94, 0.8)', 'box-shadow': '0 0 15px rgba(34, 197, 94, 0.3)' },
          '100%': { 'border-color': 'rgba(34, 197, 94, 0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
