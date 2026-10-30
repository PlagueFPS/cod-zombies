import { createFileRoute } from "@tanstack/react-router"
import { Effect, Predicate } from "effect"
import { unsubscribeEmail } from "@/data/email.server"
import { NewsletterRuntime } from "@/lib/layers"
import { NewsletterTokens } from "@/lib/services/newsletter-tokens"

export const Route = createFileRoute("/api/newsletter/unsubscribe")({
	server: {
		handlers: {
			GET: async ({ request }) =>
				await Effect.gen(function* () {
					const url = new URL(request.url)
					const token = url.searchParams.get("token")

					if (!(Predicate.isNotNullish(token) && Predicate.isTruthy(token)))
						return Response.redirect(
							new URL(
								`/newsletter/unsubscribe/error?message=${encodeURIComponent("Missing Token")}`,
								request.url,
							),
						)

					const tokens = yield* NewsletterTokens
					const email = yield* tokens.verifyUnsubscribe(token)

					yield* unsubscribeEmail(email)

					return Response.redirect(new URL(`/newsletter/unsubscribe/success`, request.url))
				}).pipe(
					Effect.withLogSpan("unsubscribe_get_handler"),
					Effect.tapCause(() => Effect.logError("Newsletter confirmation failed")),
					Effect.catchTags({
						TokenExpirationError: () => {
							const message = "The unsubscribe token used has expired. Please request a new one."

							return Effect.succeed(
								Response.redirect(
									new URL(
										`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`,
										request.url,
									),
								),
							)
						},
						TokenVerificationError: () => {
							const message = "The unsubscribe token used is invalid. Please request a new one."

							return Effect.succeed(
								Response.redirect(
									new URL(
										`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`,
										request.url,
									),
								),
							)
						},
						ResendError: () => {
							const message =
								"We were unable to unsubscribe your email from our newsletter due to a technical issue on our end. Please try again or request a new unsubscribe token. We're sorry for the inconvenience!"

							return Effect.succeed(
								Response.redirect(
									new URL(
										`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`,
										request.url,
									),
								),
							)
						},
					}),
					Effect.satisfiesErrorType<never>(),
					NewsletterRuntime.runPromise,
				),
		},
	},
})
