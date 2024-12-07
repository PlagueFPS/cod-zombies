import { env } from "@/env"
import { getYouTubeVideoID } from "@/utils/functions"
import { YouTubeEmbed } from "@next/third-parties/google"
import ExternalLink from "@/components/ExternalLink/ExternalLink"
import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

interface RichLinkProps {
  node: any
}

const youtube_url = 'https://youtu.be/'
const dev_url = 'http://localhost:3000'
const alt_dev_url = 'https://localhost:3000'

export default function RichLink({ node }: RichLinkProps) {
  if (node.data.uri.startsWith(youtube_url)) {
    return (
      <>
        <h3 className='text-foreground font-semibold mb-4'>{ node.content[0].value }</h3>
        <YouTubeEmbed videoid={ getYouTubeVideoID(node.data.uri) ?? '' } style='border-radius: var(--radius);'  />
      </>
    )
  }
  else if (node.data.uri.startsWith(env.NEXT_PUBLIC_WEBSITE_URL)) {
    return (
      <Link href={ node.data.uri }>
        { node.content[0].value }
      </Link>
    )
  }
  else if (node.data.uri.startsWith(dev_url) || node.data.uri.startsWith(alt_dev_url) || node.data.uri.startsWith('/')) {
    return (
      <Link href={ node.data.uri.replace(dev_url, env.NEXT_PUBLIC_WEBSITE_URL).replace(alt_dev_url, env.NEXT_PUBLIC_WEBSITE_URL) }>
        { node.content[0].value }
      </Link>
    )
  }
  else {
    return (
      <ExternalLink href={ node.data.uri } className='flex items-center w-fit'>
        { node.content[0].value }
        <ExternalLinkIcon className='w-4 h-4 ml-1' />
      </ExternalLink>
    )
  }
}
