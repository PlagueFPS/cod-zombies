import { BestiaryCard } from "@/components/bestiary-card"
import { EmptyGrid } from "@/components/empty-grid"
import { useIsMobile } from "@/hooks/use-mobile"
import { decodeZombie, type EncodedZombie } from "@/utils/rsc-wire"

interface IBestiaryGrid {
	zombies: EncodedZombie[]
}

export function BestiaryGrid({ zombies }: IBestiaryGrid) {
	const isMobile = useIsMobile()

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{zombies.length > 0 ? (
				zombies.map((zombie, index) => (
					<BestiaryCard
						key={zombie.id}
						zombie={decodeZombie(zombie)}
						priority={!isMobile ? index <= 3 : index === 0}
					/>
				))
			) : (
				<EmptyGrid className="col-span-4" type="Zombie" />
			)}
		</div>
	)
}
