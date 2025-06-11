import richStyles from "@/components/RichText/RichText.module.css"
import { type Document, INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { slugify, TypeGuards } from "@/utils/functions"
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
import type { ZombieItem } from "@/types/ZombieItem"
import { Asset } from "contentful"

interface RichTextRendererProps {
  body: Document
  slug: string
  overrideStyles?: boolean
  className?: string
}

export default function RichTextRenderer({ body, slug, overrideStyles, className }: RichTextRendererProps) {
  const renderOptions = {
    renderNode: {
      [INLINES.HYPERLINK]: (node: unknown) => {

        return <RichLink node={ node as { data: { uri: string }, content: [{value: string}]} } /> // TODO: Find better type solution
      },
      [INLINES.EMBEDDED_ENTRY]: (node: unknown) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "data")) return
        if (!TypeGuards.isObject(node.data)) return
        if (!TypeGuards.hasProperty(node.data, "target")) return

        return (
          <ItemTooltip 
            item={ createItemTooltipDTO(node.data.target as ZombieItem) } 
            className="font-bold items-baseline align-baseline gap-1.5"
          />
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "data")) return
        if (!TypeGuards.isObject(node.data)) return
        if (!TypeGuards.hasProperty(node.data, "target")) return

        const asset = node.data.target as Asset<undefined, string>
        return <RichImage asset={ asset } />
      },
      [BLOCKS.HEADING_2]: (node: unknown, children: React.ReactNode) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "content")) return
        if (!TypeGuards.isArray(node.content)) return
        if (!TypeGuards.hasProperty(node.content[0], "value")) return
        if (!TypeGuards.isString(node.content[0].value)) return

        return <Heading2 id={ slugify(node.content[0].value) }>{ children }</Heading2>
      },
      [BLOCKS.HEADING_3]: (node: unknown, children: React.ReactNode) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "content")) return
        if (!TypeGuards.isArray(node.content)) return
        if (!TypeGuards.hasProperty(node.content[0], "value")) return
        if (!TypeGuards.isString(node.content[0].value)) return

        return <Heading3 id={ slugify(node.content[0].value) }>{ children }</Heading3>
      },
      [BLOCKS.HEADING_4]: (node: unknown, children: React.ReactNode) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "content")) return
        if (!TypeGuards.isArray(node.content)) return
        if (!TypeGuards.hasProperty(node.content[0], "value")) return
        if (!TypeGuards.isString(node.content[0].value)) return

        return <Heading4 id={ slugify(node.content[0].value) }>{ children }</Heading4>
      },
      [BLOCKS.PARAGRAPH]: (node: unknown, children: React.ReactNode) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "content")) return
        if (!TypeGuards.isArray(node.content)) return

        let renderDiv = false
        node.content.forEach((node: unknown) => {
          if (!TypeGuards.isObject(node)) return
          if (!TypeGuards.hasProperty(node, "nodeType")) return
          if (!TypeGuards.hasProperty(node, "data")) return
          if (!TypeGuards.hasProperty(node.data, "uri")) return
          if (!TypeGuards.isString(node.data.uri)) return

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
      [BLOCKS.QUOTE]: (node: unknown, children: React.ReactNode) => {
        return (
          <RichBlockquote>
            { children }
          </RichBlockquote>
        )
      },
      [BLOCKS.TABLE]: (node: unknown) => {
        if (!TypeGuards.isObject(node)) return
        if (!TypeGuards.hasProperty(node, "content")) return
        if (!TypeGuards.isArray(node.content)) return
        if (!TypeGuards.hasProperty(node.content[0], "content")) return
        if (!TypeGuards.isArray(node.content[0].content)) return

        const headings: string[] = node.content[0].content.map((node: unknown) => {
          if (!TypeGuards.isObject(node)) return
          if (!TypeGuards.hasProperty(node, "content")) return
          if (!TypeGuards.isArray(node.content)) return
          if (!TypeGuards.hasProperty(node.content[0], "content")) return
          if (!TypeGuards.isArray(node.content[0].content)) return
          if (!TypeGuards.hasProperty(node.content[0].content[0], "value")) return
          if (!TypeGuards.isString(node.content[0].content[0].value)) return

          return node.content[0].content[0].value
        }).filter(h => h !== undefined)
        const bodyRows: unknown[] = node.content.slice(1).map((row: unknown) => {
          if (!TypeGuards.isObject(row)) return
          if (!TypeGuards.hasProperty(row, "content")) return
          return row.content
        })

        return (
          <RichTable headings={ headings } bodyRows={ bodyRows } />
        )
      },
      [BLOCKS.HR]: () => {
        return <hr className="my-2" />
      },
      [BLOCKS.UL_LIST]: (node: unknown, children: React.ReactNode) => {
        return (
          <UnorderedList>
            { children }
          </UnorderedList>
        )
      },
      [BLOCKS.OL_LIST]: (node: unknown, children: React.ReactNode) => {
        return (
          <OrderedList>
            { children }
          </OrderedList>
        )
      }
    },
    renderMark: {
      [MARKS.ITALIC]: (text: unknown) => {
        if (!TypeGuards.isObject(text)) return <i>{ text as React.ReactNode }</i>
        if (!TypeGuards.hasProperty(text, "props")) return 
        if (!TypeGuards.hasProperty(text.props, "children")) return 
        if (text?.props?.children === 'Important Note: ') return null
      }
    }
  }

  return (
    <div id="body" className={ overrideStyles ? className : cn("relative max-w-[80ch] px-4 mx-auto", richStyles.body, className) }>
      { documentToReactComponents(body, renderOptions) }
    </div>
  )
}