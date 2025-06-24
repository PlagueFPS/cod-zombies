import { EmailServiceLive } from "@/lib/services/EmailService";
import { unsubscribeEmail } from "@/usecases/email";
import { verifyToken } from "@/utils/functions";
import { Console, Effect } from "effect";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return Effect.gen(function*() {
    const token = req.nextUrl.searchParams.get("token")
    if (!token) return NextResponse.redirect(new URL(`/newsletter/unsubscribe/error?message=${encodeURIComponent("Missing Token")}`, req.url))

    const decodedToken = decodeURIComponent(token)
    const email = yield* verifyToken(decodedToken)
    const result = yield* unsubscribeEmail(email)

    yield* Console.info(result)
    return NextResponse.redirect(new URL(`/newsletter/unsubscribe/success`, req.url))
  }).pipe(
    Effect.withLogSpan("unsubscribe_get_handler"),
    Effect.tapError(error => Console.error(error)),
    Effect.catchTags({
      TokenExpirationError: () => {
        const message = "The unsubscribe token used has expired. Please request a new one."
        return Effect.succeed(NextResponse.redirect(new URL(`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`, req.url)))
      },
      TokenVerificationError: () => {
        const message = "The unsubscribe token used is invalid. Please request a new one."
        return Effect.succeed(NextResponse.redirect(new URL(`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`, req.url)))
      }
    }),
    Effect.catchAll(() => {
      const message = "An error occured during the unsubscribe process. Please try again or request a new unsubscribe token."
      return Effect.succeed(NextResponse.redirect(new URL(`/newsletter/unsubscribe/error?message=${encodeURIComponent(message)}`, req.url)))
    }),
    Effect.provide(EmailServiceLive),
    Effect.runPromise
  )
}