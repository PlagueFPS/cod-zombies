import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function SkewedPlusSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M24 8 L31 8 L38 14 L38 24 L54 24 L54 32 L48 38 L38 38 L38 55 L31 55 L24 48 L24 38 L7 38 L7 32 L15 24 L24 24 Z" />
		</FloppySymbol>
	)
}
