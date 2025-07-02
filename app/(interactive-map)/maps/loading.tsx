import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import Footer from "@/components/footer/footer"
import GridSection from "@/components/grid-section/grid-section"
import PreviewCardLoader from "@/components/loaders/preview-card-loader"
import { getAvailableMaps } from "@/data/interactive-map"

export default function MapsPageLoading() {
	const maps = getAvailableMaps()

	return (
		<>
			<div className="mt-10 w-full flex-col items-center justify-center">
				<div className="container flex flex-col items-center justify-center gap-6">
					<Breadcrumbs links={[{ title: "Maps", href: "/maps" }]} />
					<GridSection title="Interactive Maps">
						<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
							Browse our collection of interactive maps showcasing key spawn points, locations, and more.
						</p>
						<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
							{maps.map((map, index) => (
								<PreviewCardLoader key={`${map}-${index + 1}-preview-loader`} />
							))}
						</div>
					</GridSection>
				</div>
			</div>
			<Footer />
		</>
	)
}
