import { Effect } from "effect"
import { type NextRequest, NextResponse } from "next/server"
import { subscribeEmail } from "@/data/email"
import { APIRuntime } from "@/lib/layers"
import { verifyToken } from "@/utils/server-functions"

export async function GET(req: NextRequest) {
	return await Effect.gen(function* () {
		const token = req.nextUrl.searchParams.get("token")
		if (!token)
			return NextResponse.redirect(
				new URL(
					`/newsletter/subscribe/error?message=${encodeURIComponent("Missing Token")}`,
					req.url,
				),
			)

		const decodedToken = decodeURIComponent(token)
		const email = yield* verifyToken(decodedToken)

		yield* subscribeEmail(email)
		return NextResponse.redirect(new URL(`/newsletter/subscribe/success`, req.url))
	}).pipe(
		Effect.withLogSpan("subscribe_get_handler"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			TokenExpirationError: () => {
				const message = "The subscribe token used has expired. Please request a new one."
				return Effect.succeed(
					NextResponse.redirect(
						new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`, req.url),
					),
				)
			},
			TokenVerificationError: () => {
				const message = "The subscribe token used is invalid. Please request a new one."
				return Effect.succeed(
					NextResponse.redirect(
						new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`, req.url),
					),
				)
			},
			CreateContactError: () => {
				const message =
					"We were unable to subscribe your email to our newsletter due to a technical issue on our end. Please try again or request a new subscribe token. We're sorry for the inconvenience!"
				return Effect.succeed(
					NextResponse.redirect(
						new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`, req.url),
					),
				)
			},
		}),
		Effect.ensureErrorType<never>(),
		APIRuntime.runPromise,
	)
}
