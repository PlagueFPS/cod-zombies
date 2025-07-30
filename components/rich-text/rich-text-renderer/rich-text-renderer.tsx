import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, type Document, INLINES, MARKS } from "@contentful/rich-text-types"
import richStyles from "@/components/rich-text/rich-text.module.css"
import { cn } from "@/lib/utils"
import { createItemTooltipDto } from "@/utils/contentful-utils"
import { slugify } from "@/utils/functions.client"
import RichBlockquote from "../rich-blockquote/rich-blockquote"
import GKValve from "../rich-embeds/gk-valve"
import ItemTooltip from "../rich-embeds/item-tooltip"
import TerminusCode from "../rich-embeds/terminus-code"
import Heading2 from "../rich-headings/heading2/heading2"
import Heading3 from "../rich-headings/heading3/heading3"
import Heading4 from "../rich-headings/heading4/heading4"
import RichImage from "../rich-image/rich-image"
import RichLink, { youtube_url } from "../rich-link/rich-link"
import RichTable from "../rich-table/rich-table"
import { OrderedList, UnorderedList } from "../rich-text-lists/rich-text-lists"

interface RichTextRendererProps {
	body: Document
	slug: string
	overrideStyles?: boolean
	className?: string
}

export default function RichTextRenderer({
	body,
	slug,
	overrideStyles,
	className,
}: RichTextRendererProps) {
	const renderOptions = {
		renderNode: {
			[INLINES.HYPERLINK]: (node: unknown) => {
				return <RichLink node={node} />
			},
			[INLINES.EMBEDDED_ENTRY]: (node: any) => {
				return (
					<ItemTooltip
						item={createItemTooltipDto(node.data.target)}
						className="items-baseline gap-1.5 align-baseline font-bold"
					/>
				)
			},
			[BLOCKS.EMBEDDED_ASSET]: (node: any) => {
				const asset = node.data.target
				return <RichImage asset={asset} />
			},
			[BLOCKS.HEADING_2]: (node: any, children: any) => {
				return <Heading2 id={slugify(node.content[0].value)}>{children}</Heading2>
			},
			[BLOCKS.HEADING_3]: (node: any, children: any) => {
				return <Heading3 id={slugify(node.content[0].value)}>{children}</Heading3>
			},
			[BLOCKS.HEADING_4]: (node: any, children: any) => {
				return <Heading4 id={slugify(node.content[0].value)}>{children}</Heading4>
			},
			[BLOCKS.PARAGRAPH]: (node: any, children: any) => {
				let renderDiv = false
				node.content.forEach((node: any) => {
					if (node.nodeType === INLINES.HYPERLINK && node.data.uri.startsWith(youtube_url)) {
						renderDiv = true
						return
					}
					return
				})

				if (renderDiv) return <div>{children}</div>

				return <span>{children}</span>
			},
			[BLOCKS.EMBEDDED_ENTRY]: () => {
				switch (slug) {
					case "gorod-krovi":
						return <GKValve />
					case "terminus":
						return <TerminusCode />
				}
			},
			[BLOCKS.QUOTE]: (_: any, children: any) => {
				return <RichBlockquote>{children}</RichBlockquote>
			},
			[BLOCKS.TABLE]: (node: any) => {
				const headings: string[] = node.content[0].content.map(
					(node: any) => node.content[0].content[0].value,
				)
				const bodyRows: any[] = node.content.slice(1).map((row: any) => row.content)
				return <RichTable headings={headings} bodyRows={bodyRows} />
			},
			[BLOCKS.HR]: () => {
				return <hr className="my-2" />
			},
			[BLOCKS.UL_LIST]: (_: any, children: any) => {
				return <UnorderedList>{children}</UnorderedList>
			},
			[BLOCKS.OL_LIST]: (_: any, children: any) => {
				return <OrderedList>{children}</OrderedList>
			},
		},
		renderMark: {
			[MARKS.ITALIC]: (text: any) => {
				if (text?.props?.children === "Important Note: ") return null
				return <i>{text}</i>
			},
		},
	}

	return (
		<div
			id="body"
			className={
				overrideStyles
					? className
					: cn("relative mx-auto max-w-[80ch] px-4", richStyles.body, className)
			}
		>
			{documentToReactComponents(body, renderOptions)}
		</div>
	)
}
