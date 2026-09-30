import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function FourTrianglesSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M9 28 L27 28 L27 9 Z" />
			<path d="M33 9 L33 28 L52 28 Z" />
			<path d="M9 35 L27 54 L27 35 Z" />
			<path d="M33 35 L52 35 L33 54 Z" />
		</FloppySymbol>
	)
}
