import { Effect } from "effect"
import { type NextRequest, NextResponse } from "next/server"

import { unsubscribeEmail } from "@/data/email"
import { APIRuntime } from "@/lib/layers"
import { verifyToken } from "@/utils/server-functions"

export async function GET(req: NextRequest) {
	return await Effect.gen(function* () {
		const token = req.nextUrl.searchParams.get("token")
		if (!token)
			return NextResponse.redirect(
				new URL(
					`/newsletter/unsubscribe/error?message=${encodeURIComponent("Missing Token")}`,
					req.url,
				),
			)

		const decodedToken = decodeURIComponent(token)
		const email = yield* verifyToken(decodedToken)

		yield* unsubscribeEmail(email)
		return NextResponse.redirect(new URL(`/newsletter/unsubscribe/success`, req.url))
	}).pipe(
		Effect.withLogSpan("unsubscribe_get_handler"),
		Effect.tapCause(cause => Effect.logError(cause)),
		Effect.catchTags({
			TokenExpirationError: () => {
				const message = "The unsubscribe token used has expired. Please request a new one."
				return Effect.succeed(
					NextResponse.redirect(
						new URL(
							`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`,
							req.url,
						),
					),
				)
			},
			TokenVerificationError: () => {
				const message = "The unsubscribe token used is invalid. Please request a new one."
				return Effect.succeed(
					NextResponse.redirect(
						new URL(
							`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`,
							req.url,
						),
					),
				)
			},
			ResendError: () => {
				const message =
					"We were unable to unsubscribe your email from our newsletter due to a technical issue on our end. Please try again or request a new unsubscribe token. We're sorry for the inconvenience!"
				return Effect.succeed(
					NextResponse.redirect(
						new URL(
							`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`,
							req.url,
						),
					),
				)
			},
		}),
		Effect.satisfiesErrorType<never>(),
		APIRuntime.runPromise,
	)
}
