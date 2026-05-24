/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#070707',
          800: '#0f0f0f',
        },
        text: {
          primary: '#f7f7ef',
          muted: 'rgba(247, 247, 239, 0.68)',
          dim: 'rgba(247, 247, 239, 0.62)',
        },
        accent: {
          blue: '#3bb8ff',
          yellow: '#d9ff63',
          orange: 'rgba(255, 115, 55, 0.18)',
        },
      },
      fontFamily: {
        archivo: ['Archivo', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      spacing: {
        '88': '88px',
      },
    },
  },
  plugins: [],
}
