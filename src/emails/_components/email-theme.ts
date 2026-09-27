import { pixelBasedPreset, type TailwindConfig } from "@react-email/components"

/**
 * Light-theme brand colors from `src/globals.css`, converted to hex because
 * email clients do not support oklch. Primary buttons use orange-700 so white
 * label text clears WCAG AA. Accent text uses orange-800 for the same reason.
 * Canvas is the site's muted surface; ink is the site foreground.
 */
export const emailTailwindConfig = {
	presets: [pixelBasedPreset],
	theme: {
		extend: {
			colors: {
				brand: {
					canvas: "#f5f5f5",
					card: "#ffffff",
					ink: "#0a0a0a",
					body: "#262626",
					muted: "#404040",
					line: "#e5e5e5",
					primary: "#ca3500",
					accent: "#9f2d00",
					highlight: "#fff7ed",
				},
			},
			fontFamily: {
				sans: ["Geist", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
			},
			borderRadius: {
				brand: "10px",
			},
		},
	},
} satisfies TailwindConfig

export const emailButtonClassName =
	"box-border rounded-[10px] bg-brand-primary px-6 py-3 text-center text-base font-bold text-white no-underline"

export const emailLinkClassName = "text-brand-accent underline"
