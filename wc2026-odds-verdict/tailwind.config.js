/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#F4EFE3",
          alt: "#ECE5D4",
          deep: "#E2D9C2",
        },
        ink: {
          DEFAULT: "#161512",
          soft: "#2A2722",
          muted: "#6B6357",
          faint: "#9A9081",
        },
        gold: {
          DEFAULT: "#B8893A",
          soft: "#D4B97A",
          deep: "#8C6526",
        },
        pitch: {
          DEFAULT: "#2F6B4B",
          soft: "#5B9476",
          deep: "#1F4A33",
        },
        verdict: {
          DEFAULT: "#A23B2E",
          soft: "#C76A5C",
          deep: "#72251B",
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        kicker: '0.22em',
      },
      borderRadius: {
        NONE: '0px',
        xs: '2px',
        sm: '3px',
      },
      maxWidth: {
        prose: '68ch',
        read: '1100px',
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        riseIn: 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        drawLine: 'drawLine 1.1s cubic-bezier(0.65, 0, 0.35, 1) both',
      },
    },
  },
  plugins: [],
};
