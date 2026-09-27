import type { RelicType } from "@/data/relics"
import { Button, Heading, Section } from "@react-email/components"
import { requireOpengraphImageUrl } from "../utils/opengraph-image-url"
import {
	EmailBulletList,
	EmailCallout,
	EmailPreviewImage,
	EmailShell,
} from "./_components/email-shell"
import { emailButtonClassName } from "./_components/email-theme"

export interface IRelicRelease {
	type: RelicType
	/** Relic id. Same slug the site uses for the relic Open Graph image. */
	id: string
	title: string
	/** Relic effect, stored as `description` on the relic. */
	description: string
	redirectUrl: string
	unsubscribeUrl: string
	serverUrl: string
	bullets: readonly string[]
}

export function relicReleaseSubject(type: IRelicRelease["type"], title: string): string {
	return `New ${type} Relic Guide: "${title}"`
}

function RelicReleaseEmail({
	type,
	id,
	title,
	description,
	redirectUrl,
	unsubscribeUrl,
	serverUrl,
	bullets,
}: IRelicRelease) {
	const subject = relicReleaseSubject(type, title)
	const imageUrl = requireOpengraphImageUrl(serverUrl, "relics", id)

	return (
		<EmailShell
			title={subject}
			preview={description}
			serverUrl={serverUrl}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				New {type} Relic Guide
			</Heading>
			<EmailPreviewImage src={imageUrl} alt={`Preview card for the ${title} relic guide`} />
			<EmailCallout title={title} description={`Effect: ${description}`} />
			<EmailBulletList heading="What you can expect from this guide:" items={bullets} />
			<Section className="mb-8 text-center">
				<Button className={emailButtonClassName} href={redirectUrl}>
					Read the Full Guide
				</Button>
			</Section>
		</EmailShell>
	)
}

export default Object.assign(RelicReleaseEmail, {
	PreviewProps: {
		type: "Grim",
		id: "lawyers-pen",
		title: "Lawyer's Pen",
		description: "Mimic props have infiltrated the map.",
		redirectUrl: "https://www.codzombiesguides.com/relics/black-ops-7/lawyers-pen",
		unsubscribeUrl: "https://www.codzombiesguides.com/newsletter/unsubscribe",
		serverUrl: "https://www.codzombiesguides.com",
		bullets: [
			"Requirements, including the main quest, Cursed, and round 20",
			"Where to light the three red candles",
			"How the trial portal opens at Vandorn Farm",
			"What to expect from the shock mimic trial",
		],
	} satisfies IRelicRelease,
})
