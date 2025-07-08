import { YouTubeEmbed } from "@next/third-parties/google"
import { ExternalLinkIcon } from "lucide-react"
import { CustomLink } from "@/components/custom-link/custom-link"
import ExternalLink from "@/components/external-link/external-link"
import { env } from "@/env"
import { getYouTubeVideoId, slugify } from "@/utils/functions.client"
import { decodeRichLinkNode } from "@/utils/validation-schemas"
import Heading3 from "../rich-headings/heading3/heading3"

interface RichLinkProps {
	node: unknown
}

export const youtube_url = "https://youtu.be/"
const dev_url = "http://localhost:3000"
const alt_dev_url = "https://localhost:3000"

export default function RichLink({ node }: RichLinkProps) {
	const validNode = decodeRichLinkNode(node)
	if (validNode._tag === "Left") {
		console.error(validNode.left.message)
		return null
	}

	const { data, content } = validNode.right
	if (!content[0]) return null

	if (data.uri.startsWith(youtube_url)) {
		return (
			<>
				<Heading3 id={slugify(content[0].value)} className="pb-4">
					{content[0].value}
				</Heading3>
				<YouTubeEmbed
					videoid={getYouTubeVideoId(data.uri) ?? ""}
					style="border-radius: var(--radius);"
				/>
			</>
		)
	}
	if (data.uri.startsWith(env.NEXT_PUBLIC_WEBSITE_URL)) {
		return (
			<CustomLink
				href={data.uri}
				className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
			>
				{content[0].value}
			</CustomLink>
		)
	}
	if (
		data.uri.startsWith(dev_url) ||
		data.uri.startsWith(alt_dev_url) ||
		data.uri.startsWith("/")
	) {
		return (
			<CustomLink
				href={data.uri
					.replace(dev_url, env.NEXT_PUBLIC_WEBSITE_URL)
					.replace(alt_dev_url, env.NEXT_PUBLIC_WEBSITE_URL)}
				className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
			>
				{content[0].value}
			</CustomLink>
		)
	}
	return (
		<ExternalLink href={data.uri} className="flex w-fit items-center">
			{content[0].value}
			<ExternalLinkIcon className="ml-1 h-4 w-4" />
		</ExternalLink>
	)
}
