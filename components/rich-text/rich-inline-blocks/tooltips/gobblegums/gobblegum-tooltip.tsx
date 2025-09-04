import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineGobblegumBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getGobbleGumById } from "@/data/gobblegum"
import { EntryNotFoundError } from "@/types/errors"
import GobbleGumTooltipClient from "./gobblegum-tooltip-client"

export default async function GobbleGumTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineGobblegumBlock>
}) {
	return await Effect.gen(function* () {
		const gobblegum = yield* Effect.promise(() =>
			typeof node.fields.gobblegum === "string"
				? getGobbleGumById(node.fields.gobblegum)
				: getGobbleGumById(node.fields.gobblegum.id),
		)
		if (!gobblegum)
			return yield* new EntryNotFoundError({
				message: "Failed to get gobblegum",
			})

		return <GobbleGumTooltipClient gobblegum={gobblegum} />
	}).pipe(
		Effect.withLogSpan("richtext_gobblegum_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
