import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // ============================================================
      // COLORS — from Figma design system
      // ============================================================
      colors: {
        // Neutral (gray scale)
        neutral: {
          25:  "#FDFDFD",
          50:  "#FAFAFA",
          100: "#F5F5F5",
          200: "#E9EAEB",
          300: "#D5D7DA",
          400: "#A4A7AE",
          500: "#717680",
          600: "#535862",
          700: "#414651",
          800: "#252B37",
          900: "#181D27",
          950: "#0A0D12",
        },
        // Primary (blue)
        primary: {
          DEFAULT: "#1C65DA",
          light: "#D2E1FF",
          lighter: "#F6F9FE",
          foreground: "#FFFFFF",
        },
        // Accent colors
        accent: {
          red:    "#D92066",
          green:  "#079455",
          yellow: "#FDB022",
        },
        // Base
        white: "#FFFFFF",
        black: "#000000",
      },

      // ============================================================
      // FONT FAMILY — Quicksand from design system
      // ============================================================
      fontFamily: {
        sans: ["Quicksand", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Quicksand", "sans-serif"],
      },

      // ============================================================
      // FONT WEIGHTS — from design system
      // ============================================================
      fontWeight: {
        regular:   "400",
        medium:    "500",
        semibold:  "600",
        bold:      "700",
        extrabold: "800",
      },

      // ============================================================
      // BORDER RADIUS — from Figma Radius scale
      // ============================================================
      borderRadius: {
        none:  "0px",
        xxs:   "2px",
        xs:    "4px",
        sm:    "6px",
        md:    "8px",
        lg:    "10px",
        xl:    "12px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
        full:  "9999px",
      },

      // ============================================================
      // SPACING — from Figma spacing scale
      // ============================================================
      spacing: {
        "spacing-none": "0px",
        "spacing-xxs":  "2px",
        "spacing-xs":   "4px",
        "spacing-sm":   "6px",
        "spacing-md":   "8px",
        "spacing-lg":   "12px",
        "spacing-xl":   "16px",
        "spacing-2xl":  "20px",
        "spacing-3xl":  "24px",
        "spacing-4xl":  "32px",
        "spacing-5xl":  "40px",
        "spacing-6xl":  "48px",
        "spacing-7xl":  "64px",
        "spacing-8xl":  "80px",
        "spacing-9xl":  "96px",
        "spacing-10xl": "128px",
        "spacing-11xl": "140px",
      },

      // ============================================================
      // FONT SIZES — from Figma typography scale
      // ============================================================
      fontSize: {
        // Text sizes
        "text-xs":  ["12px", { lineHeight: "24px" }],
        "text-sm":  ["14px", { lineHeight: "28px" }],
        "text-md":  ["16px", { lineHeight: "30px" }],
        "text-lg":  ["18px", { lineHeight: "33px" }],
        "text-xl":  ["20px", { lineHeight: "34px" }],
        // Display sizes
        "display-xs": ["24px", { lineHeight: "36px" }],
        "display-sm": ["28px", { lineHeight: "38px" }],
        "display-md": ["32px", { lineHeight: "40px" }],
        "display-lg": ["36px", { lineHeight: "44px" }],
        "display-xl": ["40px", { lineHeight: "48px" }],
        "display-2xl":["48px", { lineHeight: "60px", letterSpacing: "-0.02em" }],
        "display-3xl":["60px", { lineHeight: "72px", letterSpacing: "-0.02em" }],
      },

      // ============================================================
      // SHADOWS
      // ============================================================
      boxShadow: {
        xs: "0px 1px 2px rgba(10, 13, 18, 0.05)",
        sm: "0px 1px 3px rgba(10, 13, 18, 0.10), 0px 1px 2px rgba(10, 13, 18, 0.06)",
        md: "0px 4px 8px -2px rgba(10, 13, 18, 0.10), 0px 2px 4px -2px rgba(10, 13, 18, 0.06)",
        lg: "0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03)",
        xl: "0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03)",
        "2xl": "0px 24px 48px -12px rgba(10, 13, 18, 0.18)",
        "3xl": "0px 32px 64px -12px rgba(10, 13, 18, 0.14)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;