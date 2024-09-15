import { Document, INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { slugify } from "@/utils/functions"
import RichImage from "../RichImage/RichImage"
import Heading2 from "../RichHeadings/Heading2/Heading2"
import Heading3 from "../RichHeadings/Heading3/Heading3"
import GKValve from "../RichEmbeds/GKValve"
import RichBlockquote from "../RichBlockquote/RichBlockquote"
import RichLink from "../RichLink/RichLink"
import RichTable from "../RichTable/RichTable"
import Heading4 from "../RichHeadings/Heading4/Heading4"
import RichParagraph from "../RichParagraph/RichParagraph"

interface RichTextRendererProps {
  body: Document
  slug: string
}

export default function RichTextRenderer({ body, slug }: RichTextRendererProps) {
  const renderOptions = {
    renderNode: {
      [INLINES.HYPERLINK]: (node: any) => {
        return <RichLink node={ node } />
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const asset = node.data.target
        return (
          <div className="relative w-full">
            <div className="absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl overflow-hidden">
              <RichImage 
                asset={ asset }
                quality={ 1 }
                className="scale-[1.5]"
              />
            </div>
            <div className="relative z-20">
              <RichImage asset={ asset } />
            </div>
          </div>
        )
      },
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
        return <RichParagraph>{ children }</RichParagraph>
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
      [BLOCKS.EMBEDDED_ENTRY]: () => {
        switch(slug) {
          case 'gorod-krovi':
            return <GKValve />
        }
      },
      [BLOCKS.QUOTE]: (node: any, children: any) => {
        return (
          <RichBlockquote>
            { children }
          </RichBlockquote>
        )
      },
      [BLOCKS.TABLE]: (node: any, children: any) => {
        const headings: string[] = node.content[0].content.map((node: any) => node.content[0].content[0].value)
        const bodyRows: any[] = node.content.slice(1).map((row: any) => row.content)
        return (
          <RichTable headings={ headings } bodyRows={ bodyRows } />
        )
      },
    },
    renderMark: {
      [MARKS.ITALIC]: (text: any) => {
        if (text?.props?.children === 'Important Note: ') return null
        else return <i>{ text }</i>
      }
    }
  }

  return documentToReactComponents(body, renderOptions)
}