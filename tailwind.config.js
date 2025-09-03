// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        'ash-grey': '#AEB4A9',
        'pale-dogwood': '#E0C1B3',
        'rosy-brown': '#D89A9E',
        'puce': '#C37D92',
        'rose-taupe': '#846267',


          'ash-grey1': {
            50: '#f7f8f7',
            100: '#e8eae7',
            200: '#d9dcd6',
            300: '#c9cec5',
            400: '#bcc1b7',
            500: '#AEB4A9', // main
            600: '#9ca392',
            700: '#858b7f',
            800: '#6d736a',
            900: '#565b54',
          },
          'pale-dogwood1': {
            50: '#faf8f6',
            100: '#f2ebe4',
            200: '#eaded1',
            300: '#e2d1bf',
            400: '#e1c9b9',
            500: '#E0C1B3', // main
            600: '#d4ab98',
            700: '#c18f73',
            800: '#a6714a',
            900: '#8b5d3e',
          },
          'rosy-brown1': {
            50: '#faf7f8',
            100: '#f0e6e7',
            200: '#e6d5d7',
            300: '#dcc4c6',
            400: '#d0afb2',
            500: '#D89A9E', // main
            600: '#c67e83',
            700: '#b26268',
            800: '#9d464d',
            900: '#882a32',
          },
          'puce1': {
            50: '#f9f6f8',
            100: '#ede3e7',
            200: '#e1d0d6',
            300: '#d5bdc5',
            400: '#c9aab4',
            500: '#C37D92', // main
            600: '#b36680',
            700: '#a04f6e',
            800: '#8c385c',
            900: '#79214a',
          },
          'rose-taupe1': {
            50: '#f5f3f4',
            100: '#e4dfe0',
            200: '#d3cbcd',
            300: '#c2b7b9',
            400: '#b1a3a6',
            500: '#846267', // main
            600: '#765158',
            700: '#684049',
            800: '#5a2f3a',
            900: '#4c1e2b',
          },
          primary: {
            50: '#e6f0ff',
            100: '#b3d1ff',
            200: '#80b3ff',
            300: '#4d94ff',
            400: '#1a75ff',
            500: '#007bff', // primary main
            600: '#0062cc',
            700: '#004a99',
            800: '#003166',
            900: '#001933',
          },
          secondary: {
            50: '#ffe6f0',
            100: '#ffb3d1',
            200: '#ff80b3',
            300: '#ff4d94',
            400: '#ff1a75',
            500: '#ff4081', // secondary main
            600: '#cc0062',
            700: '#990049',
            800: '#660031',
            900: '#330018',
          },
          gray: {
            50: '#f8f9fa',
            100: '#f1f3f5',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#6c757d',
            700: '#495057',
            800: '#343a40',
            900: '#212529',
          },



        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#007bff', // primary main
          600: '#0062cc',
          700: '#004a99',
          800: '#003166',
          900: '#001933',
        },
        secondary: {
          50: '#ffe6f0',
          100: '#ffb3d1',
          200: '#ff80b3',
          300: '#ff4d94',
          400: '#ff1a75',
          500: '#ff4081', // secondary main
          600: '#cc0062',
          700: '#990049',
          800: '#660031',
          900: '#330018',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 2px 5px 0 rgba(0,0,0,0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}