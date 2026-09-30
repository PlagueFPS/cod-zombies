import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function ChevronSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M5 16 L7 16 L31 40 L55 16 L57 16 L57 32 L35 54 L27 54 L5 32 Z" />
		</FloppySymbol>
	)
}
