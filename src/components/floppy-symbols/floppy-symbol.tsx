import type { CommonSVGProps } from "@/types/svgs"
import type { ReactNode } from "react"

export default function FloppySymbol({
	className,
	children,
	"aria-hidden": ariaHidden = true,
	...props
}: CommonSVGProps & { children: ReactNode }) {
	return (
		<svg
			{...props}
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 62 62"
			fill="currentColor"
			role="img"
			aria-hidden={ariaHidden}
		>
			{children}
		</svg>
	)
}
