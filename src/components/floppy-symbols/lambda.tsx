import type { CommonSVGProps } from "@/types/svgs"
import FloppySymbol from "@/components/floppy-symbols/floppy-symbol"

export default function LambdaSymbol(props: CommonSVGProps) {
	return (
		<FloppySymbol {...props}>
			<path d="M39 10 L2 47 L19 47 L39 27 Z" />
			<path d="M32 34 L48 34 L60 47 L44 47 Z" />
		</FloppySymbol>
	)
}
