import type { NextRequest } from "next/server"
import { Effect, Layer, Redacted, Schema } from "effect"
import { headers } from "next/headers"
import { env } from "@/env"
import { Cache } from "@/lib/services/Cache"
import { Email } from "@/lib/services/Email"
import { AuthorizationError, JSONParseError } from "@/types/errors"
import { authorizedRequest } from "@/utils/functions"
import { RevalidateHandlers } from "@/utils/revalidation-handlers"
import { AllowedSlugsSchema } from "@/utils/validation-schemas"

interface RouteParams {
	params: Promise<{ slug: string[] }>
}

const RevalidateWebhookSchema = Schema.Struct({
	entryId: Schema.String,
	createdAt: Schema.Date,
	updatedAt: Schema.Date,
})

const decodeWebhookBody = Schema.decodeUnknown(RevalidateWebhookSchema)
const decodeSlug = Schema.decodeUnknown(AllowedSlugsSchema)

const RevalidateLayer = Layer.merge(Email.Default, Cache.Default)

export async function PUT(req: NextRequest, { params }: RouteParams) {
	return await Effect.gen(function* () {
		const [{ slug }, headerList] = yield* Effect.all(
			[Effect.promise(() => params), Effect.promise(() => headers())],
			{
				concurrency: "unbounded",
			},
		)

		const secretHeader = headerList.get("X-Contentful-Revalidate-Secret") || ""
		const contentfulSecret = Redacted.make(secretHeader)
		const authed = yield* authorizedRequest(
			Redacted.value(contentfulSecret),
			Redacted.value(env.REVALIDATE_SECRET),
		)
		if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })

		const payload = yield* Effect.tryPromise({
			try: () => req.json(),
			catch: error => new JSONParseError({ message: "Failed to parse webhook body", cause: error }),
		})

		const validSlug = yield* decodeSlug(slug[0])
		const body = yield* decodeWebhookBody(payload)
		const handler = RevalidateHandlers[validSlug]

		return yield* handler(body)
	}).pipe(
		Effect.withLogSpan("put_revalidation_handler"),
		Effect.tap(() => Effect.log("Data Revalidation Completed.")),
		Effect.tapError(Effect.logError),
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
