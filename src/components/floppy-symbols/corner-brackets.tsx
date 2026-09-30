import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function CornerBracketsSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M26 8 L20 14 L20 21 L13 21 L7 27 L26 27 Z" />
			<path d="M36 8 L42 14 L42 21 L49 21 L55 27 L36 27 Z" />
			<path d="M26 55 L20 49 L20 42 L13 42 L7 36 L26 36 Z" />
			<path d="M36 55 L42 49 L42 42 L49 42 L55 36 L36 36 Z" />
		</FloppySymbol>
	)
}
