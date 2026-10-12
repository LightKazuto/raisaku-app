/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ea580c",
          dark: "#c2410c",
          soft: "#ffedd5",
          light: "#fb923c",
        },
        ink: "#111827",
        canvas: "#f9fafb",
        surface: "#ffffff",
        "surface-strong": "#f3f4f6",
        line: "#e5e7eb",
        muted: "#6b7280",
        "admin-bg": "#f3f4f6",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
