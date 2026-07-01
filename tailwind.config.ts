import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          900: "var(--color-global-blue-900)",
          1000: "var(--color-global-blue-1000)",
        },
        neutral: {
          400: "var(--color-global-neutral-grey-400)",
          500: "var(--color-global-neutral-grey-500)",
          1000: "var(--color-global-neutral-grey-1000)",
          1300: "var(--color-global-neutral-grey-1300)",
        },
        cool: {
          200: "var(--color-global-cool-grey-200)",
        },
        auth: {
          ink: "var(--color-auth-ink)",
          muted: "var(--color-auth-muted)",
          border: "var(--color-auth-border)",
          accent: "var(--color-auth-accent)",
          link: "var(--color-auth-link)",
          cream: "var(--color-auth-cream)",
          divider: "var(--color-auth-divider)",
          success: "var(--color-auth-success)",
          "success-soft": "var(--color-auth-success-soft)",
        },
        home: {
          promo: "var(--color-home-promo)",
          "promo-badge": "var(--color-home-promo-badge)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
        sans: ["var(--font-body)", "Arial", "sans-serif"],
      },
      fontSize: {
        "figma-13": ["13px", { lineHeight: "16px", letterSpacing: "0" }],
        "figma-16": ["16px", { lineHeight: "22px" }],
        "figma-48": ["48px", { lineHeight: "72px" }],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        "auth-field": "3.875rem",
        "auth-panel": "50rem",
      },
    },
  },
};

export default config;
