import type { RelicType } from "@/data/relics"
import type { TimeRange } from "@/types/data"
import { Button, Heading, Section, Text } from "@react-email/components"
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
	/** Title of the map in `Relic.map`. */
	map: string
	/** Discovery day as an ISO 8601 date-only string (`YYYY-MM-DD`). */
	discoveredDate: string
	estimatedTimeMins: TimeRange
	redirectUrl: string
	unsubscribeUrl: string
	serverUrl: string
	bullets: readonly string[]
}

export function relicReleaseSubject(type: IRelicRelease["type"], title: string): string {
	return `New ${type} Relic Guide: "${title}"`
}

export function relicReleasePreview(type: IRelicRelease["type"], title: string): string {
	return `New ${type} relic guide: ${title}`
}

function formatUnlockMinutes(minutes: number): string {
	const mins = Math.round(minutes)

	if (mins < 60) return `${mins}m`

	const hours = Math.floor(mins / 60)
	const remainder = mins % 60

	return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

function formatUnlockTime(range: TimeRange): string {
	const minLabel = formatUnlockMinutes(range.min)
	const maxLabel = formatUnlockMinutes(range.max)

	return minLabel === maxLabel ? minLabel : `${minLabel}-${maxLabel}`
}

function formatDiscoveredDate(isoDate: string): string {
	const [year, month, day] = isoDate.split("-")
	const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))

	return new Intl.DateTimeFormat("en-US", {
		timeZone: "UTC",
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(date)
}

function RelicReleaseEmail({
	type,
	id,
	title,
	description,
	map,
	discoveredDate,
	estimatedTimeMins,
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
			preview={relicReleasePreview(type, title)}
			serverUrl={serverUrl}
			unsubscribeUrl={unsubscribeUrl}
		>
			<Heading as="h1" className="text-brand-ink mx-0 mt-0 mb-6 text-center text-2xl font-bold">
				New {type} Relic Guide
			</Heading>
			<EmailPreviewImage src={imageUrl} alt={`Preview card for the ${title} relic guide`} />
			<EmailCallout title={title} description={`Effect: ${description}`} />
			<Section className="bg-brand-canvas mb-6 rounded-[10px] px-4 py-4">
				<Heading as="h2" className="text-brand-ink m-0 mb-4 text-base font-semibold">
					Relic details
				</Heading>
				<Text className="text-brand-body m-0 mb-2 text-base leading-6">Type: {type}</Text>
				<Text className="text-brand-body m-0 mb-2 text-base leading-6">Map: {map}</Text>
				<Text className="text-brand-body m-0 mb-2 text-base leading-6">
					Discovered: {formatDiscoveredDate(discoveredDate)}
				</Text>
				<Text className="text-brand-body m-0 text-base leading-6">
					Est. completion: {formatUnlockTime(estimatedTimeMins)}
					{estimatedTimeMins.reason ? `. ${estimatedTimeMins.reason}` : null}
				</Text>
			</Section>
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
		map: "Ashes of the Damned",
		discoveredDate: "2025-11-16",
		estimatedTimeMins: {
			min: 15,
			max: 30,
			reason: "Time varies slightly based on party size and gobblegum use.",
		},
		redirectUrl: "https://codzombiesguides.com/relics/black-ops-7/lawyers-pen",
		unsubscribeUrl: "https://codzombiesguides.com/newsletter/unsubscribe",
		serverUrl: "https://codzombiesguides.com",
		bullets: [
			"Requirements, including the main quest, Cursed, and round 20",
			"Where to light the three red candles",
			"How the trial portal opens at Vandorn Farm",
			"What to expect from the shock mimic trial",
		],
	} satisfies IRelicRelease,
})
