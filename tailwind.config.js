/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vino: {
          DEFAULT: '#4A0E17',
          deep: '#2D070C',
        },
        carmesi: '#C81D25',
        crema: '#F4F0EA',
        negro: '#0D0D0D',
        blanco: '#FFFFFF',
      },
      fontFamily: {
        brush: ['"Permanent Marker"', 'cursive'],
        display: ['"Archivo Black"', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        brutal: '4px 4px 0px #000000',
        'brutal-sm': '2px 2px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-xl': '8px 8px 0px #000000',
        'brutal-carmesi': '4px 4px 0px #C81D25',
        'brutal-vino': '4px 4px 0px #4A0E17',
      },
      borderWidth: {
        3: '3px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'heart-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        'heart-pop': 'heart-pop 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
