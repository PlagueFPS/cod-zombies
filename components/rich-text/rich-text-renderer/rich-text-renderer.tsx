import type { DefaultNodeTypes, SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
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
import {
	type JSXConvertersFunction,
	LinkJSXConverter,
	RichText,
} from "@payloadcms/richtext-lexical/react"
import { Suspense } from "react"
import richStyles from "@/components/rich-text/rich-text.module.css"
import { cn } from "@/lib/utils"
import { slugify } from "@/utils/functions.client"
import Heading2 from "../rich-headings/heading2/heading2"
import Heading3 from "../rich-headings/heading3/heading3"
import Heading4 from "../rich-headings/heading4/heading4"
import RichImage from "../rich-image/rich-image"
import AmmoModTooltip from "../rich-inline-blocks/tooltips/ammo-mods/ammo-mod-tooltip"
import ZombieTooltip from "../rich-inline-blocks/tooltips/zombies/zombie-tooltip"
import RichLink, { internalDocToHref } from "../rich-link/rich-link"

interface RichTextRendererProps {
	body: SerializedEditorState
	slug: string
	overrideStyles?: boolean
	className?: string
}

type NodeTypes =
	| DefaultNodeTypes
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
	...LinkJSXConverter({ internalDocToHref }),
	heading: ({ node }) => {
		console.log(node)
		switch (node.tag) {
			case "h2":
				return <Heading2 id={slugify(node.tag)}>{node.tag}</Heading2>
			case "h3":
				return <Heading3 id={slugify(node.tag)}>{node.tag}</Heading3>
			case "h4":
				return <Heading4 id={slugify(node.tag)}>{node.tag}</Heading4>
		}
	},
	link: ({ node }) => <RichLink node={node} />,
	upload: ({ node }) => <RichImage node={node} />,
	horizontalrule: () => <hr className="my-2" />,
	inlineBlocks: {
		zombie: ({ node }) => (
			<Suspense fallback={<span>Loading...</span>}>
				<ZombieTooltip node={node} />
			</Suspense>
		),
		augment: ({ node }) => <span>{node.fields.blockType}</span>,
		"ammo-mod": ({ node }) => <AmmoModTooltip node={node} />,
		"field-upgrade": ({ node }) => <span>{node.fields.blockType}</span>,
		gobblegum: ({ node }) => <span>{node.fields.blockType}</span>,
		perk: ({ node }) => <span>{node.fields.blockType}</span>,
		"weapon-build": ({ node }) => <span>{node.fields.blockType}</span>,
	},
})

export default function RichTextRenderer({
	body,
	slug,
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

// async function ItemTooltipWrapper({ node }: { node: any }) {
// 	const item = await createItemTooltipDto(node.data.target)
// 	return <ItemTooltip item={item} className="items-baseline gap-1.5 align-baseline font-bold" />
// }
