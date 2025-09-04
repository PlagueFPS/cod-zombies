import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlinePerkBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getPerkById } from "@/data/perks"
import { EntryNotFoundError } from "@/types/errors"
import PerkTooltipClient from "./perk-tooltip-client"

export default async function PerkTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlinePerkBlock>
}) {
	return await Effect.gen(function* () {
		const perk = yield* Effect.promise(() =>
			typeof node.fields.perks === "string"
				? getPerkById(node.fields.perks)
				: getPerkById(node.fields.perks.id),
		)
		if (!perk)
			return yield* new EntryNotFoundError({
				message: "Failed to get perk",
			})

		return <PerkTooltipClient perk={perk} />
	}).pipe(
		Effect.withLogSpan("richtext_perk_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
