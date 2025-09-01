import type { NextRequest } from "next/server"
import { Effect, Redacted } from "effect"
import { draftMode } from "next/headers"
import { env } from "@/env"
import { AuthorizationError, InvalidRequestError } from "@/types/errors"
import { authorizedRequest } from "@/utils/functions"

export async function GET(request: NextRequest) {
	return await Effect.gen(function* () {
		const secret = decodeURIComponent(request.nextUrl.searchParams.get("secret") ?? "")
		const authed = yield* authorizedRequest(secret, Redacted.value(env.DRAFT_SECRET))
		if (!authed)
			return yield* new AuthorizationError({
				message: "Unauthorized Request",
				cause: "Invalid Secret",
			})

		const path = decodeURIComponent(request.nextUrl.searchParams.get("path") ?? "")
		if (!path)
			return yield* new InvalidRequestError({
				message: "Invalid Request",
				cause: "Missing path",
			})

		const draft = yield* Effect.promise(() => draftMode())
		draft.enable()
		yield* Effect.log("Draft Mode Enabled")
		const redirectUrl = new URL(path, request.nextUrl.origin).href
		yield* Effect.annotateLogsScoped("redirectUrl", redirectUrl)
		return Response.redirect(redirectUrl)
	}).pipe(
		Effect.scoped,
		Effect.withLogSpan("draft_live_preview_get_handler"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			AuthorizationError: error => Effect.succeed(new Response(error.message, { status: 401 })),
			InvalidRequestError: error => Effect.succeed(new Response(error.message, { status: 400 })),
		}),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
}
