import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineGobblegumBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import GobbleGumTooltipClient from "./gobblegum-tooltip-client"

export default function GobbleGumTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineGobblegumBlock>
}) {
	return Effect.gen(function* () {
		const gobblegum = yield* assertRelation(node.fields.gobblegum).pipe(
			Effect.flatMap(gobblegum =>
				Effect.gen(function* () {
					const image = yield* assertRelation(gobblegum.image)
					return {
						id: gobblegum.id,
						title: gobblegum.title,
						rarity: gobblegum.rarity,
						type: gobblegum.type,
						description: gobblegum.description,
						image: createMediaDto(image),
					}
				}),
			),
		)
		return <GobbleGumTooltipClient gobblegum={gobblegum} />
	}).pipe(
		Effect.withLogSpan("richtext_gobblegum_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runSync,
	)
}
