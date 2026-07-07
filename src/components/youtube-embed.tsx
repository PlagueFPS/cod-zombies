"use client"
import { ClientOnly } from "@tanstack/react-router"
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css"
import LiteYoutubeEmbed from "react-lite-youtube-embed"
import { getYouTubeVideoId } from "@/utils/shared-functions"

interface YoutubeEmbedProps {
	videoLink: string
}

export default function YoutubeEmbed({ videoLink }: YoutubeEmbedProps) {
	const videoId = getYouTubeVideoId(videoLink)

	return (
		<ClientOnly>
			<LiteYoutubeEmbed id={videoId ?? ""} title="Video Guide" lazyLoad />
		</ClientOnly>
	)
}
