import { YouTubeEmbed } from "@next/third-parties/google"
import { ExternalLinkIcon } from "lucide-react"
import { CustomLink } from "@/components/custom-link/custom-link"
import ExternalLink from "@/components/external-link/external-link"
import { env } from "@/env"
import { getYouTubeVideoId, slugify } from "@/utils/functions"
import Heading3 from "../rich-headings/heading3/heading3"

interface RichLinkProps {
	node: {
		data: {
			uri: string
		}
		content: { value: string }[]
	}
}

export const youtube_url = "https://youtu.be/"
const dev_url = "http://localhost:3000"
const alt_dev_url = "https://localhost:3000"

export default function RichLink({ node }: RichLinkProps) {
	if (node.data.uri.startsWith(youtube_url)) {
		return (
			<>
				<Heading3 id={slugify(node.content[0].value)} className="pb-4">
					{node.content[0].value}
				</Heading3>
				<YouTubeEmbed videoid={getYouTubeVideoId(node.data.uri) ?? ""} style="border-radius: var(--radius);" />
			</>
		)
	}
	if (node.data.uri.startsWith(env.NEXT_PUBLIC_WEBSITE_URL)) {
		return (
			<CustomLink
				href={node.data.uri}
				className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
			>
				{node.content[0].value}
			</CustomLink>
		)
	}
	if (node.data.uri.startsWith(dev_url) || node.data.uri.startsWith(alt_dev_url) || node.data.uri.startsWith("/")) {
		return (
			<CustomLink
				href={node.data.uri
					.replace(dev_url, env.NEXT_PUBLIC_WEBSITE_URL)
					.replace(alt_dev_url, env.NEXT_PUBLIC_WEBSITE_URL)}
				className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
			>
				{node.content[0].value}
			</CustomLink>
		)
	}
	return (
		<ExternalLink href={node.data.uri} className="flex w-fit items-center">
			{node.content[0].value}
			<ExternalLinkIcon className="ml-1 h-4 w-4" />
		</ExternalLink>
	)
}
