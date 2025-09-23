import type { Metadata } from "next"
import { Suspense } from "react"
import BestiaryFilters from "@/components/bestiary-filters/bestiary-filters"
import BestiaryGridClient from "@/components/bestiary-grid/bestiary-grid"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import GridLoader from "@/components/loaders/grid-loader"
import { getZombies } from "@/data/zombies"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/functions"

export const metadata: Metadata = {
	title: "Bestiary",
	description:
		"Discover the weaknesses, behavior, and strategies for defeating all enemy types in Call of Duty: Zombies.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Bestiary",
		description:
			"Discover the weaknesses, behavior, and strategies for defeating all enemy types in Call of Duty: Zombies.",
		url: "/bestiary",
	},
	twitter: {
		title: "Bestiary",
		description:
			"Discover the weaknesses, behavior, and strategies for defeating all enemy types in Call of Duty: Zombies.",
		card: "summary_large_image",
	},
	alternates: {
		canonical: `${getServerUrl()}/bestiary`,
	},
}

export default function BestiaryPage() {
	const zombies = getZombies().map(zombie => {
		const { combatStrategy, ...rest } = zombie
		return rest
	})
	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Bestiary", href: "/bestiary" }]} />
				<GridSection title="Bestiary">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the weaknesses, behavior, and strategies for defeating all enemy types in Call
						of Duty: Zombies.
					</p>
					<BestiaryFilters />
					<Suspense fallback={<GridLoader />}>
						<BestiaryGridClient zombies={zombies} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
