import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlinePerkBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import PerkTooltipClient from "./perk-tooltip-client"

export default function PerkTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlinePerkBlock>
}) {
	return Effect.gen(function* () {
		const perk = yield* assertRelation(node.fields.perks).pipe(
			Effect.flatMap(perk =>
				Effect.gen(function* () {
					const image = yield* assertRelation(perk.image)
					return {
						id: perk.id,
						title: perk.title,
						modifier: perk.modifier,
						description: perk.description,
						image: createMediaDto(image),
					}
				}),
			),
		)
		return <PerkTooltipClient perk={perk} />
	}).pipe(
		Effect.withLogSpan("richtext_perk_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
