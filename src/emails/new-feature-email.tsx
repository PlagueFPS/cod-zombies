import { Heading, Img, Link, Section, Text } from "@react-email/components"
import { requireOpengraphImageUrl } from "../utils/opengraph-image-url"
import { EmailShell } from "./_components/email-shell"
import { emailLinkClassName } from "./_components/email-theme"

interface INewFeatureEmail {
	unsubscribeUrl: string
}

export const featureUpdateSubject = "New Main Quest Guides: Infinite Warfare"

export const featureUpdatePreview =
	"Main quest guides for every Infinite Warfare map are now available."

const siteOrigin = "https://www.codzombiesguides.com"

const infiniteWarfareMainQuests = [
	{
		mapId: "zombies-in-spaceland",
		mapTitle: "Zombies in Spaceland",
		questTitle: "Sooooul Key",
	},
	{
		mapId: "rave-in-the-redwoods",
		mapTitle: "Rave in the Redwoods",
		questTitle: "Locksmith",
	},
	{
		mapId: "shaolin-shuffle",
		mapTitle: "Shaolin Shuffle",
		questTitle: "Pest Control",
	},
	{
		mapId: "attack-of-the-radioactive-thing",
		mapTitle: "Attack of the Radioactive Thing",
		questTitle: "Soul-Less",
	},
	{
		mapId: "the-beast-from-beyond",
		mapTitle: "The Beast from Beyond",
		questTitle: "The End?",
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
				Infinite Warfare Main Quests Are Now Available
			</Heading>
			<Text className="text-brand-body mb-6 text-base leading-6">
				Main quest guides for <strong className="text-brand-accent">Infinite Warfare</strong> are
				now on the site. Each walkthrough covers the Soul Key steps for that map.
			</Text>
			{infiniteWarfareMainQuests.map(quest => {
				const href = `${siteOrigin}/main-quests/infinite-warfare/${quest.mapId}`
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
