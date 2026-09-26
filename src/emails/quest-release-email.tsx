import { Button, Heading, Section } from "@react-email/components"
import { requireOpengraphImageUrl } from "../utils/opengraph-image-url"
import {
	EmailBulletList,
	EmailCallout,
	EmailPreviewImage,
	EmailShell,
} from "./_components/email-shell"
import { emailButtonClassName } from "./_components/email-theme"

export interface IQuestRelease {
	type: "Main" | "Side"
	/** Map id for a main quest, or side-quest id. Same slug the site uses for the Open Graph image. */
	id: string
	title: string
	description: string
	redirectUrl: string
	unsubscribeUrl: string
	serverUrl: string
	bullets: readonly string[]
}

interface QuestOpengraph {
	kind: "main-quests" | "side-quests"
	label: "main" | "side"
}

function questOpengraph(type: IQuestRelease["type"]): QuestOpengraph {
	switch (type) {
		case "Main":
			return { kind: "main-quests", label: "main" }
		case "Side":
			return { kind: "side-quests", label: "side" }
		default: {
			const exhaustive: never = type

			return exhaustive
		}
	}
}

export function questReleaseSubject(type: IQuestRelease["type"], title: string): string {
	return `New ${type} Quest Guide: "${title}"`
}

export function questReleasePreview(type: IQuestRelease["type"], title: string): string {
	return `New ${type} quest guide: ${title}`
}

function QuestReleaseEmail({
	type,
	id,
	title,
	description,
	redirectUrl,
	unsubscribeUrl,
	serverUrl,
	bullets,
}: IQuestRelease) {
	const subject = questReleaseSubject(type, title)
	const opengraph = questOpengraph(type)
	const imageUrl = requireOpengraphImageUrl(serverUrl, opengraph.kind, id)

	return (
		<EmailShell
			title={subject}
			preview={questReleasePreview(type, title)}
			serverUrl={serverUrl}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				New {type} Quest Guide
			</Heading>
			<EmailPreviewImage
				src={imageUrl}
				alt={`Preview card for the ${title} ${opengraph.label} quest guide`}
			/>
			<EmailCallout title={title} description={description} />
			<EmailBulletList heading="What you can expect from this guide:" items={bullets} />
			<Section className="mb-8 text-center">
				<Button className={emailButtonClassName} href={redirectUrl}>
					Read the Full Guide
				</Button>
			</Section>
		</EmailShell>
	)
}

export default Object.assign(QuestReleaseEmail, {
	PreviewProps: {
		type: "Main",
		id: "reckoning",
		title: "Reckoning",
		description:
			"Project Janus HQ teeters on the verge of collapse. Stabilize the Aether Reactors. Unleash the Sentinel Artifact. Complete the mission that began on Terminus.",
		redirectUrl: "https://codzombiesguides.com/main-quests/black-ops-6/reckoning",
		unsubscribeUrl: "https://codzombiesguides.com/newsletter/unsubscribe",
		serverUrl: "https://codzombiesguides.com",
		bullets: [
			"How to stabilize the Aether Reactors",
			"Where to find the Sentinel Artifact",
			"Recommended loadouts for the boss fight",
			"Tips to circumvent common pain points",
		],
	} satisfies IQuestRelease,
})
