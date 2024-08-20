import type { Asset } from "contentful"
import { Document, INLINES, BLOCKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { YouTubeEmbed } from "@next/third-parties/google"
import { getYouTubeVideoID, slugify } from "@/utils/functions"
import { WEBSITE_URL } from "@/utils/constants"
import Link from "next/link"
import RichImage from "../RichImage/RichImage"
import Heading2 from "../RichHeadings/Heading2/Heading2"
import Heading3 from "../RichHeadings/Heading3/Heading3"
import GKValve from "../RichEmbeds/GKValve"
import { generateBlurDataURL } from "@/lib/generateBlurDataURL"
import { Suspense } from "react"
import RichImageLoader from "@/components/Loaders/RichImageLoader"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RichTextRendererProps {
  body: Document
  slug: string
}

interface RichImageWrapperProps {
  asset: Asset<undefined, string> | undefined
}

const youtube_url = 'https://youtu.be/'
const dev_url = 'http://localhost:3000'

export default function RichTextRenderer({ body, slug }: RichTextRendererProps) {
  const renderOptions = {
    renderNode: {
      [INLINES.HYPERLINK]: (node: any) => {
        if (node.data.uri.startsWith(youtube_url)) {
          return (
            <>
              <h3 className='text-foreground font-semibold mb-4'>{ node.content[0].value }</h3>
              <YouTubeEmbed videoid={ getYouTubeVideoID(node.data.uri) ?? '' } style='border-radius: var(--radius);'  />
            </>
          )
        }
        else if (node.data.uri.startsWith(WEBSITE_URL)) {
          return (
            <Link href={ node.data.uri }>
              { node.content[0].value }
            </Link>
          )
        }
        else if (node.data.uri.startsWith(dev_url)) {
          return (
            <Link href={ node.data.uri.replace(dev_url, WEBSITE_URL) }>
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
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const asset = node.data.target
        return (
          <Suspense fallback={<RichImageLoader />}>
            <RichImageWrapper asset={ asset } />
          </Suspense>
        )
      },
      [BLOCKS.HEADING_2]: (node: any, children: any) => {
        return <Heading2 id={ slugify(node.content[0].value) }>{ children }</Heading2>
      },
      [BLOCKS.HEADING_3]: (node: any, children: any) => {
        return <Heading3 id={ slugify(node.content[0].value) }>{ children }</Heading3>
      },
      [BLOCKS.EMBEDDED_ENTRY]: () => {
        switch(slug) {
          case 'gorod-krovi':
            return <GKValve />
        }
      },
      [BLOCKS.TABLE]: (node: any, children: any) => {
        const tableRows: any[] = children.filter((child: any) => child.type.render.displayName === 'TableRow')
        return (
          <div className="border rounded-lg w-full">
            <Table>
              <TableHeader>
                { tableRows.length > 0 && tableRows[0] }
              </TableHeader>
              <TableBody>
                { tableRows.slice(1) }
              </TableBody>
            </Table>
          </div>
        )
      },
      [BLOCKS.TABLE_ROW]: (node: any, children: any) => {
        return <TableRow>{ children }</TableRow>
      },
      [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) => {
        return <TableHead>{ children }</TableHead>
      },
      [BLOCKS.TABLE_CELL]: (node: any) => {
        const values = node.content[0].content.map((content: any) => content.value)
        const listItems: string[] = values.join(',').split(',').map((word: string) => word.trim())
        return (
          <TableCell>
            <ul className="space-y-2">
              { listItems.map((listItem, index) => (
                <li key={`${listItem}_${index}`}>
                  { listItem }
                </li>
              ))}
            </ul>
          </TableCell>
        )
      }
    }
  }

  return documentToReactComponents(body, renderOptions)
}

const RichImageWrapper = async ({ asset }: RichImageWrapperProps) => {
  const blurDataURL = await generateBlurDataURL(asset?.fields.file?.url)
  return <RichImage asset={ asset } blurDataURL={ blurDataURL } />
}