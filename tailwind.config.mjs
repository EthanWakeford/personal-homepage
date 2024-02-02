/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Calibre', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      colors: {
        black: '#100007',
        white: '#e5dada',
        tertiary: '#840032',
        accent: '#e59500',
        other: '#002642',
        dkbg1: '#0f0f0f',
        dkbg2: '#1f1f1f',
        ltbg1: '#f5f5f5',
        ltbg2: '#e5e5e5',
      },
      height: {
        '1/2vh': '50vh',
      },
    },
  },
  plugins: [],
};
