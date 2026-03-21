import { YouTubeEmbed as NextYouTubeEmbed } from "@next/third-parties/google"
import { getYouTubeVideoId } from "@/utils/shared-functions"

interface YoutubeEmbedProps {
	videoLink: string
}

export default function YoutubeEmbed({ videoLink }: YoutubeEmbedProps) {
	const videoId = getYouTubeVideoId(videoLink)

	return <NextYouTubeEmbed videoid={videoId ?? ""} style="border-radius: var(--radius)" />
}
