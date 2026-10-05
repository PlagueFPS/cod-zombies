import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function WingsDiamondSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M11 12 L31 32 L21 42 L11 32 Z" />
			<path d="M51 12 L31 32 L41 42 L51 32 Z" />
			<path d="M31 38 L40 47 L31 57 L23 47 Z" />
		</FloppySymbol>
	)
}
