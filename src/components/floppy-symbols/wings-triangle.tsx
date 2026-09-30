import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function WingsTriangleSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M10 15 L30 33 L28 38 L18 38 L10 30 Z" />
			<path d="M52 15 L32 33 L34 38 L44 38 L52 30 Z" />
			<path d="M21 52 L31 41 L42 52 Z" />
		</FloppySymbol>
	)
}
