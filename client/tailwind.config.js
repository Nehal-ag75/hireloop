/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#37352F',
          light: '#787774',
          faint: '#9B9A97',
        },
        paper: {
          DEFAULT: '#FBFBFA',
          card: '#FFFFFF',
          hover: '#F1F1EF',
        },
        line: {
          DEFAULT: '#E9E9E7',
          dark: '#D9D9D6',
        },
        accent: {
          DEFAULT: '#5B6CE8',
          hover: '#4A5BD6',
          soft: '#EEF0FD',
        },
        success: '#2F9E44',
        warning: '#E8A23D',
        danger: '#E5484D',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
        xl: '10px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        card: '0 1px 3px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
