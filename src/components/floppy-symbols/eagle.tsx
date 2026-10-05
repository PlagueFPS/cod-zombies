import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function EagleSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M10 18 L14 22 L31 40 L49 22 L53 18 L53 32 L40 46 L42 50 L21 50 L23 46 L10 32 Z" />
			<path d="M31 22 L38 28 L31 35 L25 28 Z" />
		</FloppySymbol>
	)
}
