/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#030712',
        panel: 'rgba(17, 24, 39, 0.6)',
        panelBorder: 'rgba(255, 255, 255, 0.08)',
        panelBorderHover: 'rgba(255, 255, 255, 0.16)',
        textPrimary: '#f9fafb',
        textSecondary: '#9ca3af',
        admin: '#3b82f6',
        adminDark: '#1d4ed8',
        vigilant: '#10b981',
        vigilantDark: '#047857',
        resident: '#8b5cf6',
        residentDark: '#6d28d9',
      },
      boxShadow: {
        panel: '0 20px 60px rgba(15, 23, 42, 0.4)',
      },
      borderRadius: {
        xl: '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
