import { cn } from "cn"
import { variantWebPath } from "@/lib/image-variant-paths"

interface CardImageGlowProps {
	/** Source path used by `Image` / featured cards (e.g. `/maps/foo.webp`) */
	src: string
	className?: string
}

/**
 * Dark-mode decorative glow without a second `<img>` download/decode.
 * Uses a CSS background of the small responsive variant only when `.dark` is active.
 */
export function CardImageGlow({ src, className }: CardImageGlowProps) {
	const glowSrc = variantWebPath(src, 384)

	return (
		<div
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 z-10 hidden h-full w-full bg-cover bg-center opacity-25 blur-2xl dark:block",
				className,
			)}
			style={{ backgroundImage: `url('${glowSrc}')` }}
		/>
	)
}
