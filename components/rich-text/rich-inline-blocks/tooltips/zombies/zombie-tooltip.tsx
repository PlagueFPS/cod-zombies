import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineZombieBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import ZombieTooltipClient from "./zombie-tooltip-client"

export default function ZombieTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineZombieBlock>
}) {
	return Effect.gen(function* () {
		const zombie = yield* assertRelation(node.fields.zombies)
		// return <ZombieTooltipClient zombie={zombie} />
		return <span>{zombie.title}</span>
	}).pipe(
		Effect.withLogSpan("richtext_zombie_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runSync,
	)
}
