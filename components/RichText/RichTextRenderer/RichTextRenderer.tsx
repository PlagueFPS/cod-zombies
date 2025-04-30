import richStyles from "@/components/RichText/RichText.module.css"
import { Document, INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { slugify } from "@/utils/functions"
import Heading2 from "../RichHeadings/Heading2/Heading2"
import Heading3 from "../RichHeadings/Heading3/Heading3"
import GKValve from "../RichEmbeds/GKValve"
import RichBlockquote from "../RichBlockquote/RichBlockquote"
import RichLink, { youtube_url } from "../RichLink/RichLink"
import RichTable from "../RichTable/RichTable"
import Heading4 from "../RichHeadings/Heading4/Heading4"
import ItemTooltip from "../RichEmbeds/ItemTooltip"
import { createItemTooltipDTO } from "@/utils/contentful-utils"
import TerminusCode from "../RichEmbeds/TerminusCode"
import RichImage from "../RichImage/RichImage"
import { OrderedList, UnorderedList } from "../RichTextLists/RichTextLists"
import { cn } from "@/lib/utils"

interface RichTextRendererProps {
  body: Document
  slug: string
  overrideStyles?: boolean
  className?: string
}

export default function RichTextRenderer({ body, slug, overrideStyles, className }: RichTextRendererProps) {
  const renderOptions = {
    renderNode: {
      [INLINES.HYPERLINK]: (node: any) => {
        return <RichLink node={ node } />
      },
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        return (
          <ItemTooltip 
            item={ createItemTooltipDTO(node.data.target) } 
            className="font-bold items-baseline align-baseline gap-1.5"
          />
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const asset = node.data.target 
        return <RichImage asset={ asset } />
      },
      [BLOCKS.HEADING_2]: (node: any, children: any) => {
        return <Heading2 id={ slugify(node.content[0].value) }>{ children }</Heading2>
      },
      [BLOCKS.HEADING_3]: (node: any, children: any) => {
        return <Heading3 id={ slugify(node.content[0].value) }>{ children }</Heading3>
      },
      [BLOCKS.HEADING_4]: (node: any, children: any) => {
        return <Heading4 id={ slugify(node.content[0].value) }>{ children }</Heading4>
      },
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
        let renderDiv = false
        node.content.forEach((node: any) => {
          if (node.nodeType ===  INLINES.HYPERLINK && node.data.uri.startsWith(youtube_url)) {
            return renderDiv = true
          }
        })

        if (renderDiv) return <div>{ children }</div>

        return <p>{ children }</p>
      },
      [BLOCKS.EMBEDDED_ENTRY]: () => {
        switch(slug) {
          case 'gorod-krovi':
            return <GKValve />
          case 'terminus':
            return <TerminusCode />
        }
      },
      [BLOCKS.QUOTE]: (node: any, children: any) => {
        return (
          <RichBlockquote>
            { children }
          </RichBlockquote>
        )
      },
      [BLOCKS.TABLE]: (node: any) => {
        const headings: string[] = node.content[0].content.map((node: any) => node.content[0].content[0].value)
        const bodyRows: any[] = node.content.slice(1).map((row: any) => row.content)
        return (
          <RichTable headings={ headings } bodyRows={ bodyRows } />
        )
      },
      [BLOCKS.HR]: () => {
        return <hr className="my-2" />
      },
      [BLOCKS.UL_LIST]: (node: any, children: any) => {
        return (
          <UnorderedList>
            { children }
          </UnorderedList>
        )
      },
      [BLOCKS.OL_LIST]: (node: any, children: any) => {
        return (
          <OrderedList>
            { children }
          </OrderedList>
        )
      }
    },
    renderMark: {
      [MARKS.ITALIC]: (text: any) => {
        if (text?.props?.children === 'Important Note: ') return null
        else return <i>{ text }</i>
      }
    }
  }

  return (
    <div id="body" className={ overrideStyles ? className : cn("relative max-w-[80ch] px-4 mx-auto", richStyles.body, className) }>
      { documentToReactComponents(body, renderOptions) }
    </div>
  )
}