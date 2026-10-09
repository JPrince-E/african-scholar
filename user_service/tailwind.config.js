/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bluespectrum Deep Navy Scale
        navy: {
          950: '#041329',
          900: '#061d38',
          800: '#0a2a4f',
          700: '#0f3a6b',
          600: '#123055',
          500: '#183d6b',
          50: '#f0f5fa',
        },
        // Bluespectrum Brand Orange Scale
        'brand-orange': {
          500: '#ff5200',
          600: '#e04800',
          400: '#ff6c24',
          50: '#fff5f0',
        },
        // Logo Primary Azure Blue Scale
        azure: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#00a2ff',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Logo Coral Scale
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff5200',
          600: '#e04800',
          700: '#be123c',
        },
        // Logo Sunset Scale
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff5e36',
          600: '#ff7300',
          700: '#ea580c',
        },
        // Backwards compatibility aliases for brand/royal
        brand: {
          50: '#fff5f0',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#ff5200',
          600: '#061d38',
          700: '#041329',
          800: '#041329',
          900: '#041329',
        },
        royal: {
          500: '#ff5200',
          600: '#061d38',
          700: '#041329',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px 0 rgba(0, 0, 0, 0.08)',
        'btn-solid': '0 4px 14px 0 rgba(255, 46, 99, 0.35)',
      }
    },
  },
  plugins: [],
}
