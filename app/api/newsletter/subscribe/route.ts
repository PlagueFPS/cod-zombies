import { EmailServiceLive } from "@/lib/services/EmailService";
import { subscribeEmail } from "@/usecases/email";
import { verifyToken } from "@/utils/functions";
import { Console, Effect } from "effect";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return Effect.gen(function* () {
    const token = req.nextUrl.searchParams.get("token")
    if (!token) return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent("Missing Token")}`, req.url))

    const decodedToken = decodeURIComponent(token)
    const email = yield* verifyToken(decodedToken)
    const result = yield* subscribeEmail(email)

    yield* Console.info(result)
    return NextResponse.redirect(new URL(`/newsletter/subscribe/success`, req.url))
  }).pipe(
    Effect.withLogSpan("subscribe_get_handler"),
    Effect.tapError(error => Console.error(error)),
    Effect.catchTags({
      TokenExpirationError: () => {
        const message = "The subscribe token used has expired. Please request a new one."
        return Effect.succeed(NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`, req.url)))
      },
      TokenVerificationError: () => {
        const message = "The subscribe token used is invalid. Please request a new one."
        return Effect.succeed(NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`, req.url)))
      }
    }),
    Effect.catchAll(() => {
      const message = "An error occured during the subscribe process. Please try again or request a new subscribe token."
      return Effect.succeed(NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(message)}`, req.url)))
    }),
    Effect.provide(EmailServiceLive),
    Effect.runPromise
  )
}