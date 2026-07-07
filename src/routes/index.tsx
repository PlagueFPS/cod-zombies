import { createFileRoute } from "@tanstack/react-router"
import { HeroSection } from "@/components/hero-section"
import {
	BestiarySection,
	MainQuestsSection,
	MapsSection,
	RelicsSection,
	SideQuestsSection,
} from "@/components/home-sections"
import { SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants"

export const Route = createFileRoute("/")({
	loader: ({ context }) => ({ serverUrl: context.serverUrl }),
	head: ({ loaderData }) => ({
		meta: [
			{ property: "og:url", content: loaderData?.serverUrl },
			{ property: "og:image", content: `${loaderData?.serverUrl}/opengraph-image.png` },
			{ property: "og:image:height", content: "1200" },
			{ property: "og:image:width", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: "en_US" },
			{ property: "og:site_name", content: SITE_TITLE },
			{ property: "og:email", content: "contact@codzombiesguides.com" },
			{ property: "twitter:title", content: SITE_TITLE },
			{ property: "twitter:description", content: SITE_DESCRIPTION },
			{ property: "twitter:card", content: "summary_large_image" },
			{ property: "twitter:image", content: `${loaderData?.serverUrl}/opengraph-image.png` },
		],
	}),
	component: Home,
})

function Home() {
	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<section className="my-8 flex w-full max-w-6xl flex-col gap-12">
				<MainQuestsSection />
				<SideQuestsSection />
				<RelicsSection />
				<BestiarySection />
				<MapsSection />
			</section>
		</div>
	)
}
