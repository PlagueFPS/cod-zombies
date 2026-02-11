import type { Metadata } from "next"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { GridSort } from "@/components/client/grid-sort"
import { RelicGrid } from "@/components/client/relic-grid"
import { GridLoader } from "@/components/server/grid-loader"
import { GridSection } from "@/components/server/grid-section"
import { GridSortLoader } from "@/components/server/grid-sort-loader"
import { RelicFilters } from "@/components/server/relic-filters"
import { getRelicSortOptions, getRelics } from "@/data/relics"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/server-functions"

export const metadata: Metadata = {
	title: "Cursed Relics",
	description: "Learn how to unlock the most desired relics in Black Ops 7's Cursed mode.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Cursed Relics",
		description: "Learn how to unlock the most desired relics in Black Ops 7's Cursed mode.",
		url: "/relics",
	},
	twitter: {
		title: "Cursed Relics",
		description: "Learn how to unlock the most desired relics in Black Ops 7's Cursed mode.",
		card: "summary_large_image",
	},
	alternates: {
		canonical: `${getServerUrl()}/relics`,
	},
}

export default function RelicsPage() {
	const relics = getRelics().map(({ content, ...rest }) => rest)

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Relics", href: "/relics" }]} />
				<GridSection title="Cursed Relics">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						View all discovered relics hidden within the Cursed mode on each map.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<RelicFilters />
						<Suspense fallback={<GridSortLoader />}>
							<GridSort options={getRelicSortOptions()} />
						</Suspense>
					</div>
					<Suspense fallback={<GridLoader />}>
						<RelicGrid relics={relics} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
