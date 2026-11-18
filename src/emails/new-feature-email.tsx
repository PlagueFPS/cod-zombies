import { Heading, Img, Link, Section, Text } from "@react-email/components"
import { Array as Arr } from "effect"
import { EmailShell } from "@/emails/_components/email-shell"
import { emailLinkClassName } from "@/emails/_components/email-theme"
import { requireOpengraphImageUrl } from "@/utils/opengraph-image-url"

interface INewFeatureEmail {
	unsubscribeUrl: string
}

export const featureUpdateSubject = "New Main Quest Guides: Advanced Warfare"

export const featureUpdatePreview =
	"Main quest guides for every Advanced Warfare map are now available."

const siteOrigin = "https://www.codzombiesguides.com"

const advancedWarfareMainQuests = [
	{
		mapId: "outbreak-aw",
		mapTitle: "Outbreak (AW)",
		questTitle: "Game Over, Man!",
	},
	{
		mapId: "infection",
		mapTitle: "Infection",
		questTitle: "MEAT IS MURDER",
	},
	{
		mapId: "carrier",
		mapTitle: "Carrier",
		questTitle: "Flotsam & Jetsam",
	},
	{
		mapId: "descent",
		mapTitle: "Descent",
		questTitle: "Reunion",
	},
] as const

function NewFeatureEmail({ unsubscribeUrl }: INewFeatureEmail) {
	return (
		<EmailShell
			title={featureUpdateSubject}
			preview={featureUpdatePreview}
			serverUrl={siteOrigin}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				Advanced Warfare Main Quests Are Now Available
			</Heading>
			<Text className="text-brand-body mb-6 text-base leading-6">
				Main quest guides for <strong className="text-brand-accent">Advanced Warfare</strong> are
				now on the site. Follow each Exo Zombies walkthrough from setup to the final encounter
				across all four maps.
			</Text>
			{Arr.map(advancedWarfareMainQuests, quest => {
				const href = `${siteOrigin}/main-quests/advanced-warfare/${quest.mapId}`
				const label = `${quest.questTitle} for ${quest.mapTitle}`
				const imageUrl = requireOpengraphImageUrl(siteOrigin, "main-quests", quest.mapId)

				return (
					<Section key={quest.mapId} className="mb-6">
						<Heading as="h2" className="text-brand-ink m-0 mb-3 text-center text-lg font-bold">
							<Link href={href} className={emailLinkClassName}>
								{label}
							</Link>
						</Heading>
						<Link href={href}>
							<Img
								src={imageUrl}
								alt={`Open the ${label} main quest guide`}
								width={560}
								height={294}
								className="mx-auto h-auto w-full rounded-[10px]"
							/>
						</Link>
					</Section>
				)
			})}
		</EmailShell>
	)
}

export default Object.assign(NewFeatureEmail, {
	PreviewProps: {
		unsubscribeUrl: "https://www.codzombiesguides.com/newsletter/unsubscribe",
	} satisfies INewFeatureEmail,
})
