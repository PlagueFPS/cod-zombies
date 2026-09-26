import type { Zombie } from "@/data/zombies"
import { Button, Heading, Section } from "@react-email/components"
import { requireOpengraphImageUrl } from "../utils/opengraph-image-url"
import {
	EmailBulletList,
	EmailCallout,
	EmailPreviewImage,
	EmailShell,
} from "./_components/email-shell"
import { emailButtonClassName } from "./_components/email-theme"

export interface IZombieRelease {
	type: Zombie["type"]
	/** Bestiary slug. Same id the site uses for the zombie Open Graph image. */
	id: string
	title: string
	description: string
	redirectUrl: string
	unsubscribeUrl: string
	serverUrl: string
}

const zombieBreakdownBullets = [
	"How fast they move and how to counteract it",
	"What elements they are weak against",
	"Detailed descriptions of their attacks",
	"When and how they spawn",
	"How to defeat them effectively",
] as const

export function zombieReleaseSubject(type: IZombieRelease["type"], title: string): string {
	return `New ${type} Zombie Release: "${title}"`
}

export const zombieReleasePreview =
	"We've just published a new zombie breakdown you might be interested in"

function ZombieReleaseEmail({
	type,
	id,
	title,
	description,
	redirectUrl,
	unsubscribeUrl,
	serverUrl,
}: IZombieRelease) {
	const subject = zombieReleaseSubject(type, title)
	const imageUrl = requireOpengraphImageUrl(serverUrl, "zombies", id)

	return (
		<EmailShell
			title={subject}
			preview={zombieReleasePreview}
			serverUrl={serverUrl}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				New {type} Zombie Release
			</Heading>
			<EmailPreviewImage src={imageUrl} alt={`Preview card for the ${title} ${type} zombie`} />
			<EmailCallout title={title} description={description} />
			<EmailBulletList
				heading="What you can expect from this breakdown:"
				items={zombieBreakdownBullets}
			/>
			<Section className="mb-8 text-center">
				<Button className={emailButtonClassName} href={redirectUrl}>
					View the Full Breakdown
				</Button>
			</Section>
		</EmailShell>
	)
}

export default Object.assign(ZombieReleaseEmail, {
	PreviewProps: {
		type: "Boss",
		id: "avogadro",
		title: "Avogadro",
		description:
			"The Avogadro is a boss zombie appearing on the maps Tranzit & Alpha Omega, also known as Cornelius Pernell the leader of Broken Arrow.",
		redirectUrl: "https://codzombiesguides.com/bestiary/avogadro",
		unsubscribeUrl: "https://codzombiesguides.com/newsletter/unsubscribe",
		serverUrl: "https://codzombiesguides.com",
	} satisfies IZombieRelease,
})
