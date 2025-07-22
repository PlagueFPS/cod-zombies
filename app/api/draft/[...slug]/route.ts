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

const createSuccessResponse = (path: string) =>
	Effect.gen(function* () {
		const draft = yield* Effect.promise(() => draftMode())
		draft.enable()
		return Response.redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}${path}`)
	})

export async function GET(req: NextRequest, { params }: RouteParams) {
	return await Effect.gen(function* () {
		const { slug } = yield* Effect.promise(() => params)
		const secret = req.nextUrl.searchParams.get("secret")
		const entryId = req.nextUrl.searchParams.get("entryId")

		if (!secret) return yield* new InvalidRequestError({ message: "Missing secret" })
		if (!entryId) return yield* new InvalidRequestError({ message: "Missing entryId" })

		const providedSecret = Redacted.make(secret)

		const authed = yield* authorizedRequest(
			Redacted.value(providedSecret),
			Redacted.value(env.REVALIDATE_SECRET),
		)
		if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })

		const validSlug = yield* Schema.decodeUnknown(AllowedSlugsSchema)(slug[0])

		return yield* Match.value(validSlug).pipe(
			Match.when("maps", () =>
				Effect.gen(function* () {
					const map = yield* Effect.promise(() => getMapById(true, entryId))
					if (!map)
						return yield* new EntryNotFoundError({
							message: `No map found for entryId: ${entryId}`,
						})

					return yield* createSuccessResponse(`/${map.game}/${map.slug}`)
				}),
			),
			Match.when("side-quests", () =>
				Effect.gen(function* () {
					const quest = yield* Effect.promise(() => getQuestById(true, entryId))
					if (!quest)
						return yield* new EntryNotFoundError({
							message: `No quest found for entryId: ${entryId}`,
						})

					return yield* createSuccessResponse(
						`/side-quests/${quest.game}/${quest.map}/${quest.slug}`,
					)
				}),
			),
			Match.when("zombies", () =>
				Effect.gen(function* () {
					const zombie = yield* Effect.promise(() => getZombieById(true, entryId))
					if (!zombie)
						return yield* new EntryNotFoundError({
							message: `No zombie found for entryId: ${entryId}`,
						})

					return yield* createSuccessResponse(`/bestiary/${zombie.slug}`)
				}),
			),
			Match.when("legal", () =>
				Effect.gen(function* () {
					const doc = yield* Effect.promise(() => getLegalDocById(true, entryId))
					if (!doc)
						return yield* new EntryNotFoundError({
							message: `No legal document found for entryId: ${entryId}`,
						})

					return yield* createSuccessResponse(`/${doc.slug}`)
				}),
			),
			Match.orElse(
				slug => new InvalidRequestError({ message: `No preview available for this slug: ${slug}` }),
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
