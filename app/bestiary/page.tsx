import type { Metadata } from "next"
import { Option } from "effect"
import { Suspense } from "react"
import { BestiaryGrid } from "@/components/client/bestiary-grid"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { GridSort } from "@/components/client/grid-sort"
import { BestiaryFilters } from "@/components/server/bestiary-filters"
import { GridLoader } from "@/components/server/grid-loader"
import { GridSection } from "@/components/server/grid-section"
import { GridSortLoader } from "@/components/server/grid-sort-loader"
import { getZombieSortOptions, getZombies } from "@/data/zombies"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/server-functions"

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
		const { combatStrategy, state, ...rest } = zombie
		return {
			...rest,
			state: Option.getOrNull(state),
		}
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
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<BestiaryFilters />
						<Suspense fallback={<GridSortLoader />}>
							<GridSort options={getZombieSortOptions()} />
						</Suspense>
					</div>
					<Suspense fallback={<GridLoader />}>
						<BestiaryGrid zombies={zombies} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
