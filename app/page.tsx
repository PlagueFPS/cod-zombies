import { Suspense } from "react"
import { GridLoader } from "@/components/server/grid-loader"
import { HeroSection } from "@/components/server/hero-section"
import {
	BestiarySection,
	MainQuestsSection,
	MapsSection,
	RelicsSection,
	SideQuestsSection,
} from "@/components/server/home-sections"

export default function HomePage() {
	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<section className="my-8 flex w-full max-w-6xl flex-col gap-12">
				<MainQuestsSection />
				<SideQuestsSection />
				<RelicsSection />
				<BestiarySection />
				<Suspense fallback={<GridLoader limit={3} />}>
					<MapsSection />
				</Suspense>
			</section>
		</div>
	)
}
