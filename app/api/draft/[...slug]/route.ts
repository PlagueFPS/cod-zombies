import type { NextRequest } from "next/server"
import { Effect, Match, Redacted, Schema } from "effect"
import { draftMode } from "next/headers"
import { getLegalDocById } from "@/data/legal"
import { getMapById } from "@/data/maps"
import { getQuestById } from "@/data/side-quests"
import { getZombieById } from "@/data/zombies"
import { env } from "@/env"
import { AuthorizationError, EntryNotFoundError, InvalidRequestError } from "@/types/errors"
import { authorizedRequest } from "@/utils/functions"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

interface RouteParams {
	params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
	return await Effect.gen(function* () {
		const draft = yield* Effect.promise(() => draftMode())
		const { slug } = yield* Effect.promise(() => params)
		const type = slug[0]
		const entryId = slug[1]
		const secret = req.nextUrl.searchParams.get("secret") ?? ""

		if (!entryId) return yield* new InvalidRequestError({ message: "Missing entryId" })

		const authed = yield* authorizedRequest(secret, Redacted.value(env.DRAFT_SECRET))
		if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })

		const validSlug = yield* Schema.decodeUnknown(AllowedSlugsSchema)(type)
		draft.enable()
		yield* Effect.log("Request authorized. Draft Mode has been enabled.")

		return yield* Match.value(validSlug).pipe(
			Match.when("maps", () =>
				Effect.gen(function* () {
					const map = yield* Effect.promise(() => getMapById(entryId))
					if (!map) {
						draft.disable()
						return yield* new EntryNotFoundError({
							message: `No map found for entryId: ${entryId}`,
						})
					}

					return Response.redirect(`/${map.game}/${map.slug}`)
				}),
			),
			Match.when("side-quests", () =>
				Effect.gen(function* () {
					const quest = yield* Effect.promise(() => getQuestById(entryId))
					if (!quest) {
						draft.disable()
						return yield* new EntryNotFoundError({
							message: `No quest found for entryId: ${entryId}`,
						})
					}

					return Response.redirect(`/side-quests/${quest.game}/${quest.map}/${quest.slug}`)
				}),
			),
			Match.when("zombies", () =>
				Effect.gen(function* () {
					const zombie = yield* Effect.promise(() => getZombieById(entryId))
					if (!zombie) {
						draft.disable()
						return yield* new EntryNotFoundError({
							message: `No zombie found for entryId: ${entryId}`,
						})
					}

					return Response.redirect(`/bestiary/${zombie.slug}`)
				}),
			),
			Match.when("legal", () =>
				Effect.gen(function* () {
					const doc = yield* Effect.promise(() => getLegalDocById(entryId))
					if (!doc) {
						draft.disable()
						return yield* new EntryNotFoundError({
							message: `No legal document found for entryId: ${entryId}`,
						})
					}

					return Response.redirect(`/${doc.slug}`)
				}),
			),
			Match.orElse(slug =>
				Effect.gen(function* () {
					draft.disable()
					return yield* new InvalidRequestError({
						message: `No preview available for this slug: ${slug}`,
					})
				}),
			),
		)
	}).pipe(
		Effect.withLogSpan("get_draft_handler"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			AuthorizationError: error => Effect.succeed(Response.json(error.message, { status: 401 })),
			EntryNotFoundError: error => Effect.succeed(Response.json(error.message, { status: 404 })),
			InvalidRequestError: error => Effect.succeed(Response.json(error.message, { status: 400 })),
			ParseError: error => Effect.succeed(Response.json(error.message, { status: 400 })),
		}),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
}
