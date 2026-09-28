/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        canvas:  '#FBFAF7',   // Warm Ivory — page background
        surface: {
          1: '#FFFFFF',       // Card / panel white
          2: '#F4F3F0',       // Subtle inset / recessed surface
          3: '#EAE9E5',       // Dividers, pressed states
          border: '#E6E8EC',  // Soft Grey border
          'border-focus': 'rgba(96, 165, 250, 0.50)',
        },
        brand: {
          // Primary — Powder Blue family
          blue:     '#DCEBFA',  // Powder Blue tint (bg fills)
          'blue-mid':'#90BEF0', // Mid-tone blue (icons, dividers)
          'blue-dark':'#2E6FD8', // Deep blue (text on light, active nav)
          // Secondary — Warm Peach family
          peach:    '#FBE3D5',  // Warm Peach tint (bg fills)
          'peach-mid':'#F4A97B',// Mid-tone peach (icons)
          'peach-dark':'#C15A22',// Deep peach (text accents)
          // Semantic colours (muted, light-theme appropriate)
          emerald:  '#15803D',  // Success — dark green readable on white
          'emerald-bg': '#DCFCE7',
          rose:     '#BE123C',  // Error — dark rose
          'rose-bg': '#FFE4E6',
          amber:    '#92400E',  // Warning — dark amber
          'amber-bg': '#FEF3C7',
          // Text
          text:     '#253449',  // Deep Slate — primary text
          muted:    '#6B7A8D',  // Secondary text
          faint:    '#A0ACBA',  // Placeholder / hint
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Crisp, light-theme shadows — no neon glows
        'card':       '0 1px 3px rgba(37, 52, 73, 0.08), 0 1px 2px rgba(37, 52, 73, 0.05)',
        'card-md':    '0 4px 12px rgba(37, 52, 73, 0.09), 0 1px 3px rgba(37, 52, 73, 0.06)',
        'card-lg':    '0 8px 24px rgba(37, 52, 73, 0.10), 0 2px 6px rgba(37, 52, 73, 0.06)',
        'btn-primary':'0 2px 8px rgba(46, 111, 216, 0.25)',
        'btn-peach':  '0 2px 8px rgba(193, 90, 34, 0.18)',
        'focus-ring': '0 0 0 3px rgba(96, 165, 250, 0.35)',
      },
    },
  },
  plugins: [],
}
