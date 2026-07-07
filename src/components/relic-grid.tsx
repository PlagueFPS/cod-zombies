import { EmptyGrid } from "@/components/empty-grid"
import { RelicCard } from "@/components/relic-card"
import { useIsMobile } from "@/hooks/use-mobile"
import { decodeRelic, type EncodedRelic } from "@/utils/rsc-wire"

interface RelicGridProps {
	relics: EncodedRelic[]
}

export function RelicGrid({ relics }: RelicGridProps) {
	const isMobile = useIsMobile()
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{relics.length > 0 ? (
				relics.map((relic, index) => (
					<RelicCard
						key={relic.id}
						relic={decodeRelic(relic)}
						priority={!isMobile ? index <= 3 : index === 0}
					/>
				))
			) : (
				<EmptyGrid className="col-span-4" type="Relic" />
			)}
		</div>
	)
}
