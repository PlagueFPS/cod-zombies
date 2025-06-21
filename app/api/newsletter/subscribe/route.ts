import { ExpiredSubscribeLinkError, InvalidSubscribeLinkError } from "@/types/Error";
import { processSubscribe } from "@/usecases/email";
import { verifyToken } from "@/utils/functions";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent("missing-token")}`, req.url))
  }

  const decodedToken = decodeURIComponent(token)
  const tokenResult = verifyToken(decodedToken)

  if (tokenResult.isErr()) {
    switch(tokenResult.error._tag) {
      case "TOKEN_EXPIRATION_ERROR":
        const expiredError = new ExpiredSubscribeLinkError("The subscribe link used has expired. Please request a new one.", { cause: tokenResult.error })
        console.warn(expiredError)
        return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(expiredError.message)}`, req.url))
      case "TOKEN_VERIFICATION_ERROR":
        const invalidError = new InvalidSubscribeLinkError("The subscribe link used is invalid. Please request a new one.", { cause: tokenResult.error })
        console.warn(invalidError)
        return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(invalidError.message)}`, req.url))
      default:
        console.error(tokenResult.error)
        return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent("An error occured during the subscribe process. Please try again.")}`, req.url))
    }
  }

  const process = await processSubscribe(tokenResult.value)
  if (process.isErr()) {
    console.error(process.error)
    return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(process.error.message)}`, req.url))
  }

  return NextResponse.redirect(new URL(`/newsletter/subscribe/success`, req.url))
}