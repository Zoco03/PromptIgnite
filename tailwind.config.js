/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        "on-primary": "#ffffff",
        canvas: "#ffffff",
        "soft-cloud": "#f5f5f5",
        ink: "#111111",
        charcoal: "#39393b",
        ash: "#4b4b4d",
        mute: "#707072",
        stone: "#9e9ea0",
        hairline: "#cacacb",
        "hairline-soft": "#e5e5e5",
        sale: "#d30005",
        "sale-deep": "#780700",
        success: "#007d48",
        "success-bright": "#1eaa52",
        info: "#1151ff",
        "info-deep": "#0034e3",
        "accent-pink": "#ed1aa0",
        "accent-pink-soft": "#ffb0dd",
        "accent-purple-soft": "#beaffd",
        "accent-purple-pale": "#d6d1ff",
        "accent-teal": "#0a7281",
        "accent-pink-deep": "#4c012d",
      },
      fontFamily: {
        display: [
          '"Bebas Neue"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ],
      },
      borderRadius: {
        none: "0px",
        sm: "18px",
        md: "24px",
        lg: "30px",
        full: "9999px",
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "18px",
        xl: "24px",
        xxl: "30px",
        section: "48px",
      },
      boxShadow: {
        none: "none",
        "hairline-inset": "inset 0 -1px 0 #e5e5e5",
        "search-halo": "0 0 0 12px #f5f5f5",
      }
    },
  },
  plugins: [],
}
