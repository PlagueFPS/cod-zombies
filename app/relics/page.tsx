import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import { getRelics } from "@/data/relics"

export default function RelicsPage() {
	const _relics = getRelics()

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Relics", href: "/relics" }]} />
				<GridSection title="Cursed Relics">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the relics hidden within the Cursed mode on each map.
					</p>
					{/*<Suspense fallback={<QuestFilterLoader filters={["Map", "Game"]} />}>
						<SideQuestFilters />
					</Suspense>*/}
					{/*<Suspense fallback={<GridLoader />}>
						<QuestGridClient quests={quests} />
					</Suspense>*/}
				</GridSection>
			</div>
		</div>
	)
}
