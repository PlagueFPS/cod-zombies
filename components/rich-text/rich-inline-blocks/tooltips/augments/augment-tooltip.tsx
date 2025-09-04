import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineAugmentBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getAugmentById } from "@/data/augments"
import { EntryNotFoundError } from "@/types/errors"
import AugmentTooltipClient from "./augment-tooltip-client"

export default async function AugmentTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineAugmentBlock>
}) {
	return await Effect.gen(function* () {
		const augment = yield* Effect.promise(() =>
			typeof node.fields.augments === "string"
				? getAugmentById(node.fields.augments)
				: getAugmentById(node.fields.augments.id),
		)
		if (!augment)
			return yield* new EntryNotFoundError({
				message: "Failed to get augment",
			})

		return <AugmentTooltipClient augment={augment} />
	}).pipe(
		Effect.withLogSpan("richtext_augment_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
