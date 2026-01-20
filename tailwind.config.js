/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.php",
    "./assets/js/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px', // Max 1280px même sur grands écrans
      },
    },
    extend: {
      colors: {
        // Couleurs principales (identiques au projet Next.js)
        'gaming-dark': 'rgb(15, 15, 15)',           // Background principal
        'gaming-dark-card': 'rgb(38, 38, 38)',      // Cards
        'gaming-dark-lighter': 'rgb(64, 64, 64)',   // Borders, inputs
        'gaming-accent': 'rgb(6, 214, 160)',        // Accent vert/turquoise
        'gaming-primary': 'rgb(59, 130, 246)',      // Bleu primary
        'gaming-secondary': 'rgb(64, 64, 64)',      // Secondary gris
        
        // Couleurs sémantiques
        background: 'rgb(15, 15, 15)',
        foreground: 'rgb(255, 255, 255)',
        card: 'rgb(38, 38, 38)',
        'card-foreground': 'rgb(255, 255, 255)',
        primary: 'rgb(59, 130, 246)',
        'primary-foreground': 'rgb(255, 255, 255)',
        secondary: 'rgb(64, 64, 64)',
        'secondary-foreground': 'rgb(255, 255, 255)',
        accent: 'rgb(6, 214, 160)',
        'accent-foreground': 'rgb(15, 15, 15)',
        muted: 'rgb(38, 38, 38)',
        'muted-foreground': 'rgb(163, 163, 163)',
        border: 'rgb(64, 64, 64)',
        input: 'rgb(64, 64, 64)',
        ring: 'rgb(59, 130, 246)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
