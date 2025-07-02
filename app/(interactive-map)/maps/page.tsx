import type { Metadata } from "next"
import { Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import Footer from "@/components/footer/footer"
import GridSection from "@/components/grid-section/grid-section"
import PreviewCard from "@/components/interactive-map/preview-card"
import PreviewCardLoader from "@/components/loaders/preview-card-loader"
import { getAvailableMaps } from "@/data/interactive-map"
import { GLOBAL_OG_PROPS } from "@/utils/constants"

export const metadata: Metadata = {
	title: "Interactive Maps",
	description:
		"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Interactive Maps",
		description:
			"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
		url: "/maps",
	},
	twitter: {
		title: "Interactive Maps",
		description:
			"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
		card: "summary_large_image",
	},
}

export default function MapsPage() {
	const maps = getAvailableMaps()

	return (
		<>
			<div className="mt-10 w-full flex-col items-center justify-center">
				<div className="container flex flex-col items-center justify-center gap-6">
					<Breadcrumbs links={[{ title: "Maps", href: "/maps" }]} />
					<GridSection title="Interactive Maps" className="mb-10">
						<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
							Browse our collection of interactive maps showcasing key spawn points, locations, and more.
						</p>
						<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
							{maps.map((map, index) => (
								<Suspense key={map} fallback={<PreviewCardLoader />}>
									<PreviewCard mapId={map} index={index} />
								</Suspense>
							))}
						</div>
					</GridSection>
				</div>
			</div>
			<Footer />
		</>
	)
}
