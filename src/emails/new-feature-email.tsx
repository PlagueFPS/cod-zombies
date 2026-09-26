import { Button, Heading, Img, Section, Text } from "@react-email/components"
import { EmailBulletList, EmailShell } from "./_components/email-shell"
import { emailButtonClassName } from "./_components/email-theme"

interface INewFeatureEmail {
	unsubscribeUrl: string
}

const siteOrigin = "https://codzombiesguides.com"

const reckoningPreviewSrc =
	process.env.NODE_ENV === "production"
		? `${siteOrigin}/previews/reckoning-map-preview.jpg`
		: "/static/reckoning-map-preview.jpg"

const reckoningFeatures = [
	"Locations - View locations for all Perks, Mystery Boxes, Wall Buys, Intel, and more!",
	"Objective Items - Know the locations of important objective items like Aetheric Flora, Vacuum-Seal Devices, and more.",
	"Filters - Narrow down what you are looking for in our maps with filters for each item type.",
	"Area Labels - Learn every area of the map so you are never lost.",
	"Shareable - Sharing a link of your map will save your filters so the person receiving the link sees exactly what you see.",
] as const

function NewFeatureEmail({ unsubscribeUrl }: INewFeatureEmail) {
	return (
		<EmailShell
			title="New Interactive Map: Reckoning"
			preview="The Reckoning interactive map is now available!"
			serverUrl={siteOrigin}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				The Reckoning Interactive Map is Now Available!
			</Heading>
			<Text className="text-brand-body mb-6 text-base leading-6">
				We&apos;re thrilled to announce the release of our{" "}
				<strong className="text-brand-accent">Reckoning Interactive Map</strong> for Call of Duty:
				Zombies!
			</Text>
			<Section className="mb-6">
				<Img
					src={reckoningPreviewSrc}
					alt="Top-down Reckoning map with orange markers labeled T1 Spawn, Dark Entity Containment, Mutant Research Lab, Quantum Computing Lab, and Director's Office"
					width={560}
					height={315}
					className="h-auto w-full rounded-[10px]"
				/>
				<Text className="text-brand-muted m-0 mt-2 text-center text-sm leading-5">
					A visual preview of the Reckoning interactive map
				</Text>
			</Section>
			<EmailBulletList heading="Key Features:" items={reckoningFeatures} />
			<Section className="mb-8 text-center">
				<Button className={emailButtonClassName} href={`${siteOrigin}/maps/reckoning`}>
					View the Interactive Map
				</Button>
			</Section>
		</EmailShell>
	)
}

export default Object.assign(NewFeatureEmail, {
	PreviewProps: {
		unsubscribeUrl: "https://codzombiesguides.com/newsletter/unsubscribe",
	} satisfies INewFeatureEmail,
})
