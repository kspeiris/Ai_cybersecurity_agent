/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        card: '#1e293b',
        panel: '#111827',
        accent: '#06b6d4',
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#22c55e',
      },
      boxShadow: {
        glow: '0 0 28px rgba(6, 182, 212, 0.14)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
