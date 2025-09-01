import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineFieldUpgradeBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import FieldUpgradeTooltipClient from "./field-upgrade-tooltip-client"

export default function FieldUpgradeTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineFieldUpgradeBlock>
}) {
	return Effect.gen(function* () {
		const fieldUpgrade = yield* assertRelation(node.fields.fieldUpgrades).pipe(
			Effect.flatMap(fieldUpgrade =>
				Effect.gen(function* () {
					const image = yield* assertRelation(fieldUpgrade.image)
					return {
						id: fieldUpgrade.id,
						title: fieldUpgrade.title,
						description: fieldUpgrade.description,
						image: createMediaDto(image),
					}
				}),
			),
		)
		return <FieldUpgradeTooltipClient fieldUpgrade={fieldUpgrade} />
	}).pipe(
		Effect.withLogSpan("richtext_field_upgrade_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
