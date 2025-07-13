module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["'Satoshi'", 'ui-sans-serif', 'system-ui'],
        sans: ["'Satoshi'", 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        background: '#0E1117',
        surface: '#1C1F26',
        border: '#2A2E36',
        accent: '#F25C5C',
        primary: '#E4E7EB',
        secondary: '#9CA3AF',
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.5)',
        glow: '0 0 10px rgba(255, 92, 92, 0.3)',
      },
      backdropBlur: {
        sm: '4px',
      },
      borderRadius: {
        lg: '12px',
      },
    },
  },
}; 