import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function XSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M6 15 L20 15 L28 24 L21 31 Z" />
			<path d="M42 15 L56 15 L41 31 L34 24 Z" />
			<path d="M6 47 L21 31 L28 38 L20 47 Z" />
			<path d="M42 47 L56 47 L41 31 L34 38 Z" />
			<path d="M31 26 L36 31.5 L31 37 L25.5 31.5 Z" />
		</FloppySymbol>
	)
}
