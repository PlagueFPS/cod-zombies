import type { NextRequest } from "next/server"
import { FetchHttpClient } from "@effect/platform"
import { Duration, Effect, Layer, Redacted, Schema } from "effect"
import { draftMode, headers } from "next/headers"
import { env } from "@/env"
import { revalidateRateLimit } from "@/lib/redis"
import { Cache } from "@/lib/services/Cache"
import { Email } from "@/lib/services/Email"
import { AuthorizationError, JSONParseError } from "@/types/errors"
import { authorizedRequest } from "@/utils/functions"
import { RevalidateHandlers } from "@/utils/revalidation-handlers"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

const RevalidateWebhookSchema = Schema.Struct({
	entryId: Schema.String,
	createdAt: Schema.Date,
	updatedAt: Schema.Date,
})

const decodeWebhookBody = Schema.decodeUnknown(RevalidateWebhookSchema)
const decodeSlug = Schema.decodeUnknown(AllowedSlugsSchema)

const RevalidateLayer = Layer.mergeAll(Email.Default, Cache.Default, FetchHttpClient.layer)

const cleanupDraftMode = Effect.fnUntraced(function* () {
	const draft = yield* Effect.promise(() => draftMode())
	if (draft.isEnabled) draft.disable()
	yield* Effect.log("Draft Mode Disabled.")
}, Effect.withLogSpan("cleanup_draft_mode"))

export async function PUT(req: NextRequest, { params }: RouteContext<"/api/revalidate/[...slug]">) {
	return await Effect.gen(function* () {
		const { success } = yield* Effect.promise(() =>
			revalidateRateLimit.blockUntilReady(
				"global_revalidation_key",
				Duration.toMillis("30 seconds"),
			),
		)
		if (!success)
			return new Response("Unable to process request within the timeout window.", { status: 500 })

		const [{ slug }, headerList] = yield* Effect.all(
			[Effect.promise(() => params), Effect.promise(() => headers())],
			{
				concurrency: "unbounded",
			},
		)

		const secretHeader = headerList.get("X-Contentful-Revalidate-Secret")
		if (!secretHeader)
			return yield* new AuthorizationError({
				message: "Unauthorized Request",
				cause: new Error("Missing Auth Header"),
			})

		const contentfulSecret = Redacted.make(secretHeader)
		const authed = yield* authorizedRequest(
			Redacted.value(contentfulSecret),
			Redacted.value(env.REVALIDATE_SECRET),
		)
		if (!authed)
			return yield* new AuthorizationError({
				message: "Unauthorized Request",
				cause: new Error("Client secret did not match expected value"),
			})

		const payload = yield* Effect.tryPromise({
			try: () => req.json(),
			catch: error => new JSONParseError({ message: "Failed to parse webhook body", cause: error }),
		})

		const validSlug = yield* decodeSlug(slug[0])
		const body = yield* decodeWebhookBody(payload)
		const draft = yield* Effect.promise(() => draftMode())
		draft.enable()
		yield* Effect.log("Draft Mode Enabled.")

		const handler = RevalidateHandlers[validSlug]
		return yield* handler(body)
	}).pipe(
		Effect.withLogSpan("put_revalidation_handler"),
		Effect.tapBoth({
			onSuccess: () => cleanupDraftMode(),
			onFailure: error =>
				Effect.gen(function* () {
					yield* cleanupDraftMode()
					yield* Effect.logError(error)
				}),
		}),
		Effect.catchTags({
			AuthorizationError: error => Effect.succeed(Response.json(error.message, { status: 401 })),
			EntryNotFoundError: error => Effect.succeed(Response.json(error.message, { status: 404 })),
			ParseError: error => Effect.succeed(Response.json(error.message, { status: 400 })),
			JSONParseError: error => Effect.succeed(Response.json(error.message, { status: 400 })),
		}),
		Effect.catchAll(error => Effect.succeed(Response.json(error.message, { status: 500 }))),
		Effect.provide(RevalidateLayer),
		Effect.runPromise,
	)
}
