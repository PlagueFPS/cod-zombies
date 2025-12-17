import Breadcrumbs, { type Link } from "../breadcrumbs/breadcrumbs"
import GridSection from "../grid-section/grid-section"
import FilterLoader from "./filter-loader"
import GridLoader from "./grid-loader"
import GridPaginationLoader from "./grid-pagination-loader"

export default function SideQuestsPageLoader() {
	const links: Link<string>[] = [{ title: "Side Quests", href: `/side-quests` }]

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-10">
				<Breadcrumbs links={links} />
				<GridSection title="Side Quests">
					<p className="-mt-7 mb-2 text-lg text-muted-foreground">
						Discover the hidden secrets and rewards beyond the main story.
					</p>
					<FilterLoader filters={["Map", "Game"]} />
					<GridLoader />
					<GridPaginationLoader pages={5} />
				</GridSection>
			</div>
		</div>
	)
}
