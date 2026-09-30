import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function TripleSlashSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M3 17 L28 43 L3 43 Z" />
			<path d="M19 17 L44 43 L33 43 L19 27 Z" />
			<path d="M34 16 L60 43 L49 43 L34 26 Z" />
		</FloppySymbol>
	)
}
