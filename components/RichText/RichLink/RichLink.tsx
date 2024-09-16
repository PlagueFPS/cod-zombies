import { clientEnv } from "@/env/client"
import { getYouTubeVideoID } from "@/utils/functions"
import { YouTubeEmbed } from "@next/third-parties/google"
import Link from "next/link"

interface RichLinkProps {
  node: any
}

const youtube_url = 'https://youtu.be/'
const dev_url = 'http://localhost:3000'

export default function RichLink({ node }: RichLinkProps) {
  if (node.data.uri.startsWith(youtube_url)) {
    return (
      <>
        <h3 className='text-foreground font-semibold mb-4'>{ node.content[0].value }</h3>
        <YouTubeEmbed videoid={ getYouTubeVideoID(node.data.uri) ?? '' } style='border-radius: var(--radius);'  />
      </>
    )
  }
  else if (node.data.uri.startsWith(clientEnv.NEXT_PUBLIC_WEBSITE_URL)) {
    return (
      <Link href={ node.data.uri }>
        { node.content[0].value }
      </Link>
    )
  }
  else if (node.data.uri.startsWith(dev_url)) {
    return (
      <Link href={ node.data.uri.replace(dev_url, clientEnv.NEXT_PUBLIC_WEBSITE_URL) }>
        { node.content[0].value }
      </Link>
    )
  }
  else {
    return (
      <a href={ node.data.uri } target='_blank' rel='noopener noreferrer'>
        { node.content[0].value }
      </a>
    )
  }
}
