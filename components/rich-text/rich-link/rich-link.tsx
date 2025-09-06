import type { SerializedLinkNode } from "@payloadcms/richtext-lexical"
import type { Route } from "next"
import { Effect } from "effect"
import { ExternalLinkIcon } from "lucide-react"
import { CustomLink } from "@/components/custom-link/custom-link"
import ExternalLink from "@/components/external-link/external-link"
import { getMapById } from "@/data/maps"
import { getZombieById } from "@/data/zombies"
import { EntryNotFoundError, RelationshipError } from "@/types/errors"
import { fullyDecodeURIComponent } from "@/utils/functions.client"
import { decodeRichLinkNode } from "@/utils/validation-schemas"

interface RichLinkProps {
	node: SerializedLinkNode
}

export const youtube_url = "https://youtu.be/"
export const youtube_shorts_url = "https://youtube.com/shorts/"

export default async function RichLink({ node }: RichLinkProps) {
	return await Effect.gen(function* () {
		const { text } = yield* decodeRichLinkNode(node.children[0])
		if (node.fields.linkType === "internal") {
			const href = yield* internalDocToHref({ linkNode: node })
			return (
				<CustomLink
					href={href as Route}
					className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
				>
					{text}
				</CustomLink>
			)
		}

		if (!node.fields.url) return null
		const decodedUrl = fullyDecodeURIComponent(node.fields.url)

		if (decodedUrl.startsWith("#") && node.fields.newTab === false) {
			return (
				<CustomLink
					href={decodedUrl as Route}
					className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
				>
					{text}
				</CustomLink>
			)
		}
		return (
			<ExternalLink href={decodedUrl} className="inline-flex w-fit items-center">
				{text}
				<ExternalLinkIcon className="ml-1 h-4 w-4" />
			</ExternalLink>
		)
	}).pipe(
		Effect.withLogSpan("rich_link_component"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) =>
	Effect.gen(function* () {
		const doc = linkNode.fields.doc
		if (!doc)
			return yield* new RelationshipError({
				message: "Internal doc missing for internal link",
			})
		const { relationTo, value } = doc
		switch (relationTo) {
			case "zombies": {
				if (typeof value === "string") {
					const zombie = yield* Effect.promise(() => getZombieById(value))
					if (!zombie)
						return yield* new EntryNotFoundError({
							message: `Failed to get zombie by id: ${value}`,
						})

					return `/bestiary/${zombie.slug}`
				}

				return `/bestiary/${value.slug}`
			}
			case "maps": {
				const map = yield* Effect.promise(() =>
					typeof value === "string" ? getMapById(value) : getMapById(value.id),
				)
				if (!map)
					return yield* new EntryNotFoundError({
						message: `Failed to get map by id: ${value}`,
					})

				return `/${map.game.slug}/${map.slug}`
			}
			case "sideQuests": {
				return `/side-quests/${value}`
			}
		}

		return "#"
	}).pipe(
		Effect.withLogSpan("internal_doc_to_href"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed("#")),
		Effect.ensureErrorType<never>(),
	)
