import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineAmmoModBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getAmmoModById } from "@/data/ammo-mods"
import { EntryNotFoundError } from "@/types/errors"
import AmmoModTooltipClient from "./ammo-mod-tooltip-client"

export default async function AmmoModTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineAmmoModBlock>
}) {
	return await Effect.gen(function* () {
		const ammoMod = yield* Effect.promise(() =>
			typeof node.fields.ammoMods === "string"
				? getAmmoModById(node.fields.ammoMods)
				: getAmmoModById(node.fields.ammoMods.id),
		)
		if (!ammoMod)
			return yield* new EntryNotFoundError({
				message: "Failed to get ammo mod",
			})

		return <AmmoModTooltipClient ammoMod={ammoMod} />
	}).pipe(
		Effect.withLogSpan("richtext_ammo_mod_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
