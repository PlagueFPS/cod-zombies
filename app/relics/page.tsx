import type { Metadata } from "next"
import { Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import GridLoader from "@/components/loaders/grid-loader"
import RelicFilters from "@/components/relic-filters/relic-filters"
import RelicGrid from "@/components/relic-grid/relic-grid"
import { getRelics } from "@/data/relics"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/functions"

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
	alternates:{
		canonical: `${getServerUrl()}/relics`,
	}
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
					<RelicFilters />
					<Suspense fallback={<GridLoader />}>
						<RelicGrid relics={relics} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
