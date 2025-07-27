import Breadcrumbs from "../breadcrumbs/breadcrumbs"
import GridSection from "../grid-section/grid-section"
import GridLoader from "./grid-loader"
import GridPaginationLoader from "./grid-pagination-loader"
import QuestFilterLoader from "./quest-filter-loader"

export default function SideQuestsPageLoader() {
	const links: { title: string; href: string }[] = [{ title: "Side Quests", href: `/side-quests` }]

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-10">
				<Breadcrumbs links={links} />
				<GridSection title="Side Quests">
					<p className="-mt-7 mb-2 text-lg text-muted-foreground">
						Discover the hidden secrets and rewards beyond the main story.
					</p>
					<QuestFilterLoader filters={["Map", "Game"]} />
					<GridLoader />
					<GridPaginationLoader pages={5} />
				</GridSection>
			</div>
		</div>
	)
}
