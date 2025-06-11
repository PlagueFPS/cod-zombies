import { env } from "@/env"
import { getYouTubeVideoID, slugify } from "@/utils/functions"
import { YouTubeEmbed } from "@next/third-parties/google"
import ExternalLink from "@/components/ExternalLink/ExternalLink"
import { ExternalLinkIcon } from "lucide-react"
import { CustomLink } from "@/components/CustomLink/CustomLink"
import Heading3 from "../RichHeadings/Heading3/Heading3"

interface RichLinkProps {
  node: {
    data: {
      uri: string
    }
    content: [{ value: string }]
  }
}

export const youtube_url = 'https://youtu.be/'
const dev_url = 'http://localhost:3000'
const alt_dev_url = 'https://localhost:3000'

export default function RichLink({ node }: RichLinkProps) {
  if (node.data.uri.startsWith(youtube_url)) {
    return (
      <>
        <Heading3 id={ slugify(node.content[0].value) } className='pb-4'>{ node.content[0].value }</Heading3>
        <YouTubeEmbed videoid={ getYouTubeVideoID(node.data.uri) ?? '' } style='border-radius: var(--radius);'  />
      </>
    )
  }
  else if (node.data.uri.startsWith(env.NEXT_PUBLIC_WEBSITE_URL)) {
    return (
      <CustomLink href={ node.data.uri } className="inline-flex text-orange-600 font-medium dark:text-primary underline underline-offset-4 hover:no-underline transition-all">
        { node.content[0].value }
      </CustomLink>
    )
  }
  else if (node.data.uri.startsWith(dev_url) || node.data.uri.startsWith(alt_dev_url) || node.data.uri.startsWith('/')) {
    return (
      <CustomLink href={ node.data.uri.replace(dev_url, env.NEXT_PUBLIC_WEBSITE_URL).replace(alt_dev_url, env.NEXT_PUBLIC_WEBSITE_URL) } className="inline-flex text-orange-600 font-medium dark:text-primary underline underline-offset-4 hover:no-underline transition-all">
        { node.content[0].value }
      </CustomLink>
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
