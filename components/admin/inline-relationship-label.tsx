import type { BlocksFieldLabelServerComponent, CollectionSlug } from "payload"
import { FieldLabel } from "@payloadcms/ui"
import { Effect, Predicate } from "effect"
import { Suspense } from "react"
import { PayloadFindByIDError } from "@/types/errors"

interface InlineRelationshipValue {
	relationTo: CollectionSlug
	value: string
}

const InlineRelationshipLabel: BlocksFieldLabelServerComponent = props => {
	return (
		<Suspense>
			<InlineRelationshipLabelData {...props} />
		</Suspense>
	)
}

export default InlineRelationshipLabel

const InlineRelationshipLabelData: BlocksFieldLabelServerComponent = async ({
	clientField,
	path,
	required,
	formState,
	payload,
}) => {
	return await Effect.gen(function* () {
		let label = clientField.label || clientField.name
		if (!formState?.relationship?.value)
			return <FieldLabel label={label} path={path} required={required} />

		const { relationTo, value } = formState.relationship.value as InlineRelationshipValue
		const doc = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: relationTo,
					id: value,
					select: {
						title: true,
					},
				}),
			catch: error =>
				new PayloadFindByIDError({
					message: `Failed to find document for relation: ${relationTo} with ID: ${value}`,
					cause: error,
				}),
		})

		if (Predicate.hasProperty(doc, "title")) label = doc.title

		return <FieldLabel label={label} path={path} required={required} />
	}).pipe(
		Effect.withLogSpan("inline_relationship_label"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() =>
			Effect.succeed(
				<FieldLabel
					label={clientField.label || clientField.name}
					path={path}
					required={required}
				/>,
			),
		),
		Effect.runPromise,
	)
}
