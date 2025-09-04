import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineFieldUpgradeBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { getFieldUpgradeById } from "@/data/field-upgrades"
import { EntryNotFoundError } from "@/types/errors"
import FieldUpgradeTooltipClient from "./field-upgrade-tooltip-client"

export default async function FieldUpgradeTooltip({
	node,
}: {
	node: SerializedInlineBlockNode<InlineFieldUpgradeBlock>
}) {
	return await Effect.gen(function* () {
		const fieldUpgrade = yield* Effect.promise(() =>
			typeof node.fields.fieldUpgrades === "string"
				? getFieldUpgradeById(node.fields.fieldUpgrades)
				: getFieldUpgradeById(node.fields.fieldUpgrades.id),
		)
		if (!fieldUpgrade)
			return yield* new EntryNotFoundError({
				message: "Failed to get field upgrade",
			})

		return <FieldUpgradeTooltipClient fieldUpgrade={fieldUpgrade} />
	}).pipe(
		Effect.withLogSpan("richtext_field_upgrade_block"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(<span>{node.fields.blockType}</span>)),
		Effect.runPromise,
	)
}
