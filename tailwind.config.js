/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050508',
        'bg-2': '#08080f',
        'bg-card': 'rgba(255,255,255,0.03)',
        cyan: { DEFAULT: '#00d4ff', dark: '#00aacc' },
        green: { DEFAULT: '#00ff88' },
        purple: { DEFAULT: '#7b2fff' },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'orbit': 'orbit 22s linear infinite',
        'orbit-rev': 'orbit 34s linear infinite reverse',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
