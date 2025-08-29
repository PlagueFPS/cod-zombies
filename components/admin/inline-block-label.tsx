import type { BlocksFieldLabelServerComponent, CollectionSlug } from "payload"
import { FieldLabel } from "@payloadcms/ui"
import { Effect, Predicate } from "effect"
import { Suspense } from "react"
import { PayloadFindByIDError } from "@/types/errors"

const InlineBlockLabel: BlocksFieldLabelServerComponent = props => {
	return (
		<Suspense>
			<InlineBlockLabelData {...props} />
		</Suspense>
	)
}

export default InlineBlockLabel

const InlineBlockLabelData: BlocksFieldLabelServerComponent = async ({
	path,
	required,
	formState,
	payload,
}) => {
	return await Effect.gen(function* () {
		let label = "inline-block"
		const relationTo = Object.keys(formState)[1]
		if (!relationTo) return <FieldLabel label={label} path={path} required={required} />

		const relationId = formState[relationTo]?.value
		if (!relationId || typeof relationId !== "string")
			return <FieldLabel label={label} path={path} required={required} />

		const doc = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: relationTo as CollectionSlug,
					id: relationId,
					select: {
						title: true,
					},
				}),
			catch: error =>
				new PayloadFindByIDError({
					message: `Failed to find document for relation: ${relationTo} with ID: ${relationId}`,
					cause: error,
				}),
		})

		if (Predicate.hasProperty(doc, "title")) label = doc.title

		return <FieldLabel label={label} path={path} required={required} />
	}).pipe(
		Effect.withLogSpan("inline_block_label"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() =>
			Effect.succeed(<FieldLabel label={"inline-block"} path={path} required={required} />),
		),
		Effect.runPromise,
	)
}
