/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0F19',
        surface: {
          1: '#111827',
          2: '#1E293B',
          3: '#273549',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-focus': 'rgba(99, 102, 241, 0.40)',
        },
        brand: {
          indigo: '#6366F1',
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          coral: '#F43F5E',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 4px 24px -2px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 4px 24px -2px rgba(6, 182, 212, 0.30)',
        'glow-emerald': '0 0 24px -3px rgba(16, 185, 129, 0.25)',
        'glow-coral': '0 0 24px -3px rgba(244, 63, 94, 0.25)',
        'card-stage': '0 20px 50px -10px rgba(0, 0, 0, 0.6), 0 0 35px -5px rgba(99, 102, 241, 0.15)',
      },
    },
  },
  plugins: [],
}
