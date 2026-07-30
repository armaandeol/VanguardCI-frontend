/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        canvas: {
          DEFAULT: "#0d1117",
          inset: "#010409",
          surface: "#161b22",
          surfaceHover: "#1c2129",
          border: "#30363d",
          borderMuted: "#21262d",
          textMuted: "#8b949e",
        },
        brand: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#3fb950",
            500: "#2ea043",
            600: "#238636",
            700: "#196c2e",
            800: "#165c26",
            900: "#0f4a1e",
            glow: "#2ea043",
            emerald: "#3fb950",
          }
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.24)",
        'card-hover': "0 4px 12px rgba(0, 0, 0, 0.3)",
        glow: "0 1px 2px rgba(0, 0, 0, 0.24)",
        'glow-strong': "0 4px 12px rgba(0, 0, 0, 0.3)",
        'glow-neon': "0 1px 2px rgba(0, 0, 0, 0.24)",
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
};
