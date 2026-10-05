import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function SlantedNSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M3 10 L20 27 L20 49 L3 49 Z" />
			<path d="M21 10 L59 49 L42 49 L21 27 Z" />
		</FloppySymbol>
	)
}
