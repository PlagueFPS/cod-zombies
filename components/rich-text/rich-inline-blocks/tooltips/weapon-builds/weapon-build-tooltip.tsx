import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineWeaponBuildBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getWeaponBuildById } from "@/data/weapon-builds"
import { EntryNotFoundError } from "@/types/errors"
import WeaponBuildTooltipClient from "./weapon-build-tooltip-client"

export default async function WeaponBuildTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineWeaponBuildBlock>
}) {
	return await Effect.gen(function* () {
		const weaponBuild = yield* Effect.promise(() =>
			typeof node.fields.weaponBuilds === "string"
				? getWeaponBuildById(node.fields.weaponBuilds)
				: getWeaponBuildById(node.fields.weaponBuilds.id),
		)
		if (!weaponBuild)
			return yield* new EntryNotFoundError({
				message: "Failed to get weapon build",
			})

		return <WeaponBuildTooltipClient weaponBuild={weaponBuild} />
	}).pipe(
		Effect.withLogSpan("richtext_weapon_build_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
