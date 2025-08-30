import type { SerializedLinkNode } from "@payloadcms/richtext-lexical"
import type { Route } from "next"
import { ExternalLinkIcon } from "lucide-react"
import { CustomLink } from "@/components/custom-link/custom-link"
import ExternalLink from "@/components/external-link/external-link"

interface RichLinkProps {
	node: SerializedLinkNode
}

export const youtube_url = "https://youtu.be/"
export const youtube_shorts_url = "https://youtube.com/shorts/"
// const _dev_url = "http://localhost:3000"
// const _alt_dev_url = "https://localhost:3000"

export default function RichLink({ node }: RichLinkProps) {
	if (node.fields.linkType === "internal")
		return (
			<CustomLink
				href={(node.fields.url as Route) ?? "#"}
				className="inline-flex font-medium text-primary underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
			>
				{node.children[0]
					? "text" in node.children[0]
						? (node.children[0].text as string)
						: ""
					: ""}
			</CustomLink>
		)

	return (
		<ExternalLink href={node.fields.url ?? "#"} className="inline-flex w-fit items-center">
			{node.children[0]
				? "text" in node.children[0]
					? (node.children[0].text as string)
					: ""
				: ""}
			<ExternalLinkIcon className="ml-1 h-4 w-4" />
		</ExternalLink>
	)
}

export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
	const doc = linkNode.fields.doc
	if (!doc) return "#"
	const { relationTo, value } = doc
	if (typeof value !== "object") return "#"

	switch (relationTo) {
		case "zombies":
			return `/bestiary/${value.slug}`
		case "maps":
			return `/${value.game}/${value.slug}`
		case "sideQuests":
			return `/side-quests/${value.game}/${value.map}/${value.slug}`
		default:
			return "#"
	}
}
