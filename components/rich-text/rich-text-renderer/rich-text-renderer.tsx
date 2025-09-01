import type {
	DefaultNodeTypes,
	SerializedInlineBlockNode,
	SerializedTableCellNode,
	SerializedTableNode,
	SerializedTableRowNode,
} from "@payloadcms/richtext-lexical"
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical"
import type {
	InlineAmmoModBlock,
	InlineAugmentBlock,
	InlineFieldUpgradeBlock,
	InlineGobblegumBlock,
	InlinePerkBlock,
	InlineWeaponBuildBlock,
	InlineZombieBlock,
} from "@/types/payload-types"
import { type JSXConvertersFunction, RichText } from "@payloadcms/richtext-lexical/react"
import { Predicate } from "effect"
import { Suspense } from "react"
import richStyles from "@/components/rich-text/rich-text.module.css"
import { Table, TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { slugify } from "@/utils/functions.client"
import RichBlockquote from "../rich-blockquote/rich-blockquote"
import Heading2 from "../rich-headings/heading2/heading2"
import Heading3 from "../rich-headings/heading3/heading3"
import Heading4 from "../rich-headings/heading4/heading4"
import RichImage from "../rich-image/rich-image"
import AmmoModTooltip from "../rich-inline-blocks/tooltips/ammo-mods/ammo-mod-tooltip"
import FieldUpgradeTooltip from "../rich-inline-blocks/tooltips/field-upgrades/field-upgrade-tooltip"
import GobbleGumTooltip from "../rich-inline-blocks/tooltips/gobblegums/gobblegum-tooltip"
import PerkTooltip from "../rich-inline-blocks/tooltips/perks/perk-tooltip"
import ZombieTooltip from "../rich-inline-blocks/tooltips/zombies/zombie-tooltip"
import RichLink from "../rich-link/rich-link"
import { OrderedList, UnorderedList } from "../rich-text-lists/rich-text-lists"

interface RichTextRendererProps {
	body: SerializedEditorState
	overrideStyles?: boolean
	className?: string
}

type TableNodes = SerializedTableNode | SerializedTableRowNode | SerializedTableCellNode

type NodeTypes =
	| DefaultNodeTypes
	| TableNodes
	| SerializedInlineBlockNode<
			| InlineAmmoModBlock
			| InlineZombieBlock
			| InlineAugmentBlock
			| InlineFieldUpgradeBlock
			| InlineGobblegumBlock
			| InlinePerkBlock
			| InlineWeaponBuildBlock
	  >

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
	...defaultConverters,
	heading: ({ node }) => {
		const heading = node.children[0]
		if (!heading || !Predicate.hasProperty(heading, "text") || !Predicate.isString(heading.text))
			return null

		switch (node.tag) {
			case "h2":
				return <Heading2 id={slugify(node.tag)}>{heading.text}</Heading2>
			case "h3":
				return <Heading3 id={slugify(node.tag)}>{heading.text}</Heading3>
			case "h4":
				return <Heading4 id={slugify(node.tag)}>{heading.text}</Heading4>
		}
	},
	link: ({ node }) => {
		return (
			<Suspense fallback={<span>Loading...</span>}>
				<RichLink node={node} />
			</Suspense>
		)
	},
	upload: ({ node }) => <RichImage node={node} />,
	horizontalrule: () => <hr className="my-2" />,
	list: ({ node, nodesToJSX }) => {
		const nodes = nodesToJSX({ nodes: node.children })
		if (node.tag === "ul") return <UnorderedList>{nodes}</UnorderedList>
		if (node.tag === "ol") return <OrderedList>{nodes}</OrderedList>
	},
	quote: ({ node, nodesToJSX }) => {
		const nodes = nodesToJSX({ nodes: node.children })
		return <RichBlockquote>{nodes}</RichBlockquote>
	},
	table: ({ node, nodesToJSX }) => {
		const nodes = nodesToJSX({ nodes: node.children })
		return <Table>{nodes}</Table>
	},
	tablerow: ({ node, nodesToJSX }) => {
		const nodes = nodesToJSX({ nodes: node.children })
		return <TableRow>{nodes}</TableRow>
	},
	tablecell: ({ node, nodesToJSX }) => {
		const nodes = nodesToJSX({ nodes: node.children })
		return <TableCell>{nodes}</TableCell>
	},
	inlineBlocks: {
		zombie: ({ node }) => (
			<Suspense fallback={<span>Loading...</span>}>
				<ZombieTooltip node={node} />
			</Suspense>
		),
		augment: ({ node }) => <span>{node.fields.blockType}</span>,
		"ammo-mod": ({ node }) => <AmmoModTooltip node={node} />,
		"field-upgrade": ({ node }) => <FieldUpgradeTooltip node={node} />,
		gobblegum: ({ node }) => (
			<Suspense fallback={<span>Loading...</span>}>
				<GobbleGumTooltip node={node} />
			</Suspense>
		),
		perk: ({ node }) => <PerkTooltip node={node} />,
		"weapon-build": ({ node }) => <span>{node.fields.blockType}</span>,
	},
})

export default function RichTextRenderer({
	body,
	overrideStyles,
	className,
}: RichTextRendererProps) {
	return (
		<RichText
			data={body}
			converters={jsxConverters}
			className={
				overrideStyles
					? className
					: cn("relative mx-auto max-w-[80ch] px-4", richStyles.body, className)
			}
		/>
	)
}
