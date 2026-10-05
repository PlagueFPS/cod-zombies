import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function ChevronBarSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M5 13 L25 32 L45 13 L45 29 L38 36 L45 36 L55 48 L10 48 L17 40 L5 29 Z" />
		</FloppySymbol>
	)
}
