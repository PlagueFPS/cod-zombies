import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import Link from 'next/link'
import { YouTubeEmbed } from '@next/third-parties/google'
import { getYouTubeVideoID  } from '@/utils/functions'
import { env } from '@/utils/env'
import RichImage from '@/components/RichText/RichImage/RichImage'
import Heading2 from '@/components/RichText/RichHeadings/Heading2/Heading2'
import Heading3 from '@/components/RichText/RichHeadings/Heading3/Heading3'

const youtube_url = 'https://youtu.be/'
const dev_url = 'http://localhost:3000'

export const renderOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: (node) => {
      if (node.data.uri.startsWith(youtube_url)) {
        return (
          <>
            <h3 className='text-foreground font-semibold mb-4'>{ node.content[0].value }</h3>
            <YouTubeEmbed videoid={ getYouTubeVideoID(node.data.uri) } style='border-radius: var(--radius);'  />
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
      else if (node.data.uri.startsWith(dev_url)) {
        return (
          <Link href={ node.data.uri.replace(dev_url, env.NEXT_PUBLIC_WEBSITE_URL) }>
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
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = node.data.target
      return <RichImage asset={ asset } />
    },
    [BLOCKS.HEADING_2]: (node, children) => {
      return <Heading2 id={ node.content[0].value.toLowerCase().replace(/ /g, '-') } url={ env.NEXT_PUBLIC_WEBSITE_URL }>{ children }</Heading2>
    },
    [BLOCKS.HEADING_3]: (node, children) => {
      return <Heading3 id={ node.content[0].value.toLowerCase().replace(/ /g, '-') } url={ env.NEXT_PUBLIC_WEBSITE_URL }>{ children }</Heading3>
    },
  }
}