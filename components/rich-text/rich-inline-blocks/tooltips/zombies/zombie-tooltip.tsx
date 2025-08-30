import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineZombieBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getZombieById } from "@/data/zombies"
import { EntryNotFoundError } from "@/types/errors"
import ZombieTooltipClient from "./zombie-tooltip-client"

export default async function ZombieTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineZombieBlock>
}) {
	return await Effect.gen(function* () {
		const zombie = yield* Effect.promise(() =>
			typeof node.fields.zombies === "string"
				? getZombieById(node.fields.zombies)
				: getZombieById(node.fields.zombies.id),
		)
		if (!zombie)
			return yield* new EntryNotFoundError({
				message: "Failed to get zombie",
			})

		return <ZombieTooltipClient zombie={zombie} />
	}).pipe(
		Effect.withLogSpan("richtext_zombie_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.runPromise,
	)
}
