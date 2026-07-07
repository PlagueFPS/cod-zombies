import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { subscribeEmail } from "@/data/email.server"
import { APIRuntime } from "@/lib/layers"
import { verifyToken } from "@/utils/functions.server"

export const Route = createFileRoute("/api/newsletter/subscribe")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				return await Effect.gen(function* () {
					const url = new URL(request.url)
					const token = url.searchParams.get("token")
					if (!token)
						return Response.redirect(
							new URL(
								`/newsletter/subscribe/error?message=${encodeURIComponent("Missing Token")}`,
								request.url,
							),
						)

					const decodedToken = decodeURIComponent(token)
					const email = yield* verifyToken(decodedToken)

					yield* subscribeEmail(email)
					return Response.redirect(new URL(`/newsletter/subscribe/success`, request.url))
				}).pipe(
					Effect.withLogSpan("newsletter_subscribe_get_handler"),
					Effect.tapCause(cause => Effect.logError(cause)),
					Effect.catchTags({
						TokenExpirationError: () => {
							const message = "The subscribe token used has expired. Please request a new one."
							return Effect.succeed(
								Response.redirect(
									new URL(
										`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`,
										request.url,
									),
								),
							)
						},
						TokenVerificationError: () => {
							const message = "The subscribe token used is invalid. Please request a new one."
							return Effect.succeed(
								Response.redirect(
									new URL(
										`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`,
										request.url,
									),
								),
							)
						},
						ResendError: () => {
							const message =
								"We were unable to subscribe your email to our newsletter due to a technical issue on our end. Please try again or request a new subscribe token. We're sorry for the inconvenience!"
							return Effect.succeed(
								Response.redirect(
									new URL(
										`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`,
										request.url,
									),
								),
							)
						},
					}),
					Effect.satisfiesErrorType<never>(),
					APIRuntime.runPromise,
				)
			},
		},
	},
})
