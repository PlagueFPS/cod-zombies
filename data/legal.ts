import type { TypeLegalSkeleton } from "@/contentful/Types/contentful-types"
import { Effect } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { CMS } from "@/lib/services/CMS"
import { CACHE_KEYS } from "@/utils/constants"

export const getLegalDocuments = cache(
	unstable_cache(
		async (draftMode: boolean) => {
			return await Effect.gen(function* () {
				const legalDocs = yield* INTERNAL_getLegalDocuments()

				return legalDocs.map(doc => ({
					id: doc.sys.id,
					updatedAt: doc.sys.updatedAt,
					slug: doc.fields.slug,
				}))
			}).pipe(Effect.withLogSpan("get_legal_documents"), Effect.provide(CMS.Default(draftMode)), Effect.runPromise)
		},
		[],
		{
			tags: [CACHE_KEYS.legal.all],
		},
	),
)

export const getLegalDocBySlug = cache(
	unstable_cache(
		async (draftMode: boolean, slug: string) => {
			return await Effect.gen(function* () {
				const docs = yield* INTERNAL_getLegalDocuments()

				const doc = docs.find(doc => doc.fields.slug === slug)
				if (!doc) return null

				return {
					id: doc.sys.id,
					updatedAt: doc.sys.updatedAt,
					title: doc.fields.title,
					slug: doc.fields.slug,
					content: doc.fields.content,
				}
			}).pipe(Effect.withLogSpan("get_legal_doc_by_slug"), Effect.provide(CMS.Default(draftMode)), Effect.runPromise)
		},
		[],
		{
			tags: [CACHE_KEYS.legal.all],
		},
	),
)

export const getLegalDocById = cache(
	unstable_cache(
		async (draftMode: boolean, id: string) => {
			return await Effect.gen(function* () {
				const docs = yield* INTERNAL_getLegalDocuments()

				const doc = docs.find(doc => doc.sys.id === id)
				if (!doc) return null

				return {
					id: doc.sys.id,
					slug: doc.fields.slug,
				}
			}).pipe(Effect.withLogSpan("get_legal_doc_by_id"), Effect.provide(CMS.Default(draftMode)), Effect.runPromise)
		},
		[],
		{
			tags: [CACHE_KEYS.legal.all],
		},
	),
)

const INTERNAL_getLegalDocuments = cache(() =>
	Effect.gen(function* () {
		const { getEntries } = yield* CMS
		const data = yield* getEntries<TypeLegalSkeleton>({
			content_type: "legal",
			select: ["sys.id", "sys.updatedAt", "fields"],
		})
		return data.items
	}).pipe(
		Effect.withLogSpan("internal_get_legal_documents"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)
