import Breadcrumbs, { type Link } from "../breadcrumbs/breadcrumbs"
import GridSection from "../grid-section/grid-section"
import FilterLoader from "./filter-loader"
import GridLoader from "./grid-loader"

export default function RelicsPageLoader() {
	const links: Link<string>[] = [{ title: "Relics", href: `/relics` }]

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={links} />
				<GridSection title="Cursed Relics">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						View all discovered relics hidden within the Cursed mode on each map.
					</p>
					<FilterLoader filters={["Map", "Type"]} />
					<GridLoader />
				</GridSection>
			</div>
		</div>
	)
}
