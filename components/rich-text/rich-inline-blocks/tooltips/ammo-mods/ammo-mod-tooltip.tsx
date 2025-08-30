import type { SerializedInlineBlockNode } from "@payloadcms/richtext-lexical"
import type { InlineAmmoModBlock } from "@/types/payload-types"
import { Effect } from "effect"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

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
					const augments = ammoMod.augments.docs
						? yield* Effect.forEach(ammoMod.augments.docs, augment =>
								Effect.gen(function* () {
									const { title, description, type, image } = yield* assertRelation(augment)
									const media = yield* assertRelation(image)

									return {
										title,
										description,
										type,
										image: createMediaDto(media),
									}
								}),
							)
						: []

					return {
						title: ammoMod.title,
						description: ammoMod.description,
						image: createMediaDto(image),
						augments,
					}
				}),
			),
		)

		return ammoMod
	})
}
