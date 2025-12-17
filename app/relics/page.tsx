import { Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import GridLoader from "@/components/loaders/grid-loader"
import RelicFilters from "@/components/relic-filters/relic-filters"
import { getRelics } from "@/data/relics"

export default function RelicsPage() {
	const _relics = getRelics().map(relic => {
		const { content, ...rest } = relic
		return rest
	})

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Relics", href: "/relics" }]} />
				<GridSection title="Cursed Relics">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the relics hidden within the Cursed mode on each map.
					</p>
					<RelicFilters />
					<Suspense fallback={<GridLoader />} />
				</GridSection>
			</div>
		</div>
	)
}
