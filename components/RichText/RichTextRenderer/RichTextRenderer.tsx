import { Document, INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import type { ImageProps } from "@/types/Image"
import { Suspense } from "react"
import ImageLoader from "@/components/Loaders/ImageLoader"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { slugify } from "@/utils/functions"
import Heading2 from "../RichHeadings/Heading2/Heading2"
import Heading3 from "../RichHeadings/Heading3/Heading3"
import GKValve from "../RichEmbeds/GKValve"
import RichBlockquote from "../RichBlockquote/RichBlockquote"
import RichLink from "../RichLink/RichLink"
import RichTable from "../RichTable/RichTable"
import Heading4 from "../RichHeadings/Heading4/Heading4"
import RichParagraph from "../RichParagraph/RichParagraph"
import ContentfulImage from "@/components/ContentfulImage/ContentfulImage"
import FeaturedImage from "@/components/FeaturedImage/FeaturedImage"
import ItemTooltip from "../RichEmbeds/ItemTooltip"
import { createItemTooltipDTO } from "@/utils/contentful-utils"
import TerminusCode from "../RichEmbeds/TerminusCode"

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
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        return (
          <ItemTooltip 
            item={ createItemTooltipDTO(node.data.target) } 
            className="font-bold items-baseline align-baseline gap-1.5 text-orange-600 dark:text-orange-200"
          />
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const asset = node.data.target
        const imageProps: ImageProps = {
          featuredImage: {
            url: asset.fields.file.url,
            width: asset.fields.file.details.image.width,
            height: asset.fields.file.details.image.height
          },
          sizes: "(max-width: 828px) calc(100vw - 16px), 776px",
          quality: 100
        } 

        return (
          <div className="relative w-full mt-8">
            <div className="absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-3xl overflow-hidden">
              <FeaturedImage {...imageProps} description={ asset.fields.description } className="scale-[1.5] rounded-lg">
                <Suspense fallback={<ImageLoader className="relative h-[calc(50dvw)] lg:h-[446px] border mb-14" />}>
                  <ContentfulImage {...imageProps} className="scale-[1.5] rounded-lg" />
                </Suspense>
              </FeaturedImage>
            </div>
            <div className="relative z-20">
                <FeaturedImage {...imageProps} description={ asset.fields.description } className="rounded-lg">
                  <Suspense fallback={<ImageLoader className="relative h-[calc(50dvw)] lg:h-[446px] border mb-14" />}>
                    <ContentfulImage {...imageProps} className="rounded-lg" />
                  </Suspense>
                </FeaturedImage>
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