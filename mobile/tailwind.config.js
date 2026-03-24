/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        foreground: '#fafafa',
        card: '#131316',
        primary: '#a3e635',
        primaryForeground: '#000000',
        secondary: '#232329',
        muted: '#2d2d33',
        mutedForeground: '#a1a1a1',
        border: '#1f1f24',
        destructive: '#ef4444',
        success: '#10b981',
        warning: '#eab308',
      },
    },
  },
  plugins: [],
}
