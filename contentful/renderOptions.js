import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import RichImage from '@/components/RichText/RichImage/RichImage'
import Heading1 from '@/components/RichText/RichHeadings/Heading1/Heading1'
import Heading2 from '@/components/RichText/RichHeadings/Heading2/Heading2'
import Link from 'next/link'

const website_url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}`
const youtube_url = 'https://youtu.be/'

export const renderOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: (node) => {
      if (node.data.uri.startsWith(youtube_url)) {
        return (
          <>
            <h3 className='text-foreground font-semibold'>{ node.content[0].value }</h3>
            <iframe 
              width="560" 
              height="415" 
              src={ node.data.uri.replace('youtu.be/', 'www.youtube-nocookie.com/embed/') }
              className='w-full rounded'
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen></iframe>
          </>
        )
      }
      else if (node.data.uri.startsWith(website_url)) {
        return (
          <Link href={ node.date.uri }>
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
    [BLOCKS.HEADING_1]: (node, children) => {
      return <Heading1>{ children }</Heading1>
    },
    [BLOCKS.HEADING_2]: (node, children) => {
      return <Heading2>{ children }</Heading2>
    },
  }
}