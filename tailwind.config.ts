import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          alternative: "hsl(var(--secondary-2))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
      },
      backgroundImage: {
        "gobblegum-time-based": 'radial-gradient(circle at top,rgba(0,255,64,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-round-based": 'radial-gradient(circle at top,rgba(0,68,255,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-immediate": 'radial-gradient(circle at top,rgba(255,153,0,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-player-activated": 'radial-gradient(circle at top,rgba(195,0,255,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-ultra": 'radial-gradient(circle at top,rgba(255,0,0,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-legendary": 'radial-gradient(circle at top,rgba(255,153,0,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-epic": 'radial-gradient(circle at top,rgba(195,0,255,.25),hsl(240,10%,6%) 80%)',
        "gobblegum-rare": 'radial-gradient(circle at top,rgba(0,68,255,.25),hsl(240,10%,6%) 80%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config