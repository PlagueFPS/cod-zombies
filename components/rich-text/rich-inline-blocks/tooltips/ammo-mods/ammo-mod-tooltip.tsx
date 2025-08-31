import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineAmmoModBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import AmmoModTooltipClient from "./ammo-mod-tooltip-client"

export default function AmmoModTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineAmmoModBlock>
}) {
	return Effect.gen(function* () {
		const ammoMod = yield* assertRelation(node.fields.ammoMods).pipe(
			Effect.flatMap(ammoMod =>
				Effect.gen(function* () {
					const image = yield* assertRelation(ammoMod.image)
					return {
						id: ammoMod.id,
						title: ammoMod.title,
						description: ammoMod.description,
						image: createMediaDto(image),
					}
				}),
			),
		)
		return <AmmoModTooltipClient ammoMod={ammoMod} />
	}).pipe(
		Effect.withLogSpan("richtext_ammo_mod_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runSync,
	)
}
