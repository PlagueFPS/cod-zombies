import { Document, INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { slugify } from "@/utils/functions"
import RichImage from "../RichImage/RichImage"
import Heading2 from "../RichHeadings/Heading2/Heading2"
import Heading3 from "../RichHeadings/Heading3/Heading3"
import GKValve from "../RichEmbeds/GKValve"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RichBlockquote from "../RichBlockquote/RichBlockquote"
import React from "react"
import RichLink from "../RichLink/RichLink"

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
      [BLOCKS.QUOTE]: (node: any, children: any) => {
        return (
          <RichBlockquote>
            { children }
          </RichBlockquote>
        )
      },
      [BLOCKS.TABLE]: (node: any, children: any) => {
        const tableRows: any[] = children.filter((child: any) => child.type === TableRow)
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