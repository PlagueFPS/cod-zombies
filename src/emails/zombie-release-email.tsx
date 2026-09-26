import type { IQuestRelease } from "./quest-release-email"
import type { Zombie } from "@/data/zombies"
import { Button, Heading, Section } from "@react-email/components"
import { EmailBulletList, EmailCallout, EmailShell } from "./_components/email-shell"
import { emailButtonClassName } from "./_components/email-theme"

export interface IZombieRelease extends Omit<IQuestRelease, "type" | "bullets"> {
	type: Zombie["type"]
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
	title,
	description,
	redirectUrl,
	unsubscribeUrl,
	serverUrl,
}: IZombieRelease) {
	const subject = zombieReleaseSubject(type, title)

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
		title: "Avogadro",
		description:
			"The Avogadro is a boss zombie appearing on the maps Tranzit & Alpha Omega, also known as Cornelius Pernell the leader of Broken Arrow.",
		redirectUrl: "https://codzombiesguides.com/bestiary/avogadro",
		unsubscribeUrl: "https://codzombiesguides.com/newsletter/unsubscribe",
		serverUrl: "https://codzombiesguides.com",
	} satisfies IZombieRelease,
})
