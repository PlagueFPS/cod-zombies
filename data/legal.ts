import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/services/Payload"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"

export const getLegalDocBySlug = cache(
	unstable_cache(
		async (slug: string) => {
			return await Effect.gen(function* () {
				const payload = yield* Payload
				const legalDoc = yield* Effect.tryPromise({
					try: () =>
						payload.find({
							collection: "legal",
							pagination: false,
							draft: IN_DEVELOPMENT,
							where: {
								slug: {
									equals: slug,
								},
							},
							select: {
								createdAt: false,
							},
						}),
					catch: error =>
						new EntryNotFoundError({
							message: `Failed to get legal document by slug: ${slug}`,
							cause: error,
						}),
				}).pipe(Effect.map(legalDoc => legalDoc.docs[0] ?? null))

				return legalDoc
			}).pipe(
				Effect.withLogSpan("get_legal_doc_by_slug"),
				Effect.tapError(Effect.logError),
				Effect.catchAll(_error => Effect.succeed(null)),
				Effect.ensureErrorType<never>(),
				Effect.provide(Payload.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.legal.all],
		},
	),
)

export const getLegalDocsMetadata = cache(unstable_cache(async () => {
	return await Effect.gen(function*(){
		const payload = yield* Payload
		const legalDocs = yield* Effect.tryPromise({
			try: () => payload.find({
				collection: "legal",
				pagination: false,
				draft: IN_DEVELOPMENT,
				select: {
					slug: true,
					updatedAt: true,
				},
			}),
			catch: error => new GetEntriesError({
				message: "Failed to get legal docs metadata",
				cause: error,
			})
		}).pipe(Effect.map(legalDocs => legalDocs.docs))

		return legalDocs
	}).pipe(
		Effect.withLogSpan("get_legal_docs_metadata"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed([])),
		Effect.ensureErrorType<never>(),
		Effect.provide(Payload.Default),
		Effect.runPromise,
	)
}, [], {
	tags: [CACHE_KEYS.legal.all]
}))
