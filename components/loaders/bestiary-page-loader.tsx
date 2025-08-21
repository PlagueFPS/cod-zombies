import type { Link } from "../breadcrumbs/breadcrumbs"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"
import GridSection from "../grid-section/grid-section"
import BestiaryFiltersLoader from "./bestiary-filters-loader"
import GridLoader from "./grid-loader"
import GridPaginationLoader from "./grid-pagination-loader"

export default function BestiaryPageLoader() {
	const links: Link<string>[] = [{ title: "Bestiary", href: `/bestiary` }]

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-12">
				<Breadcrumbs links={links} />
				<GridSection title="Bestiary">
					<p className="-mt-7 mb-2 text-lg text-muted-foreground">
						Learn about the weaknesses, behavior, and strategies to defeat the undead horde.
					</p>
					<BestiaryFiltersLoader />
					<GridLoader />
					<GridPaginationLoader pages={7} />
				</GridSection>
			</div>
		</div>
	)
}
