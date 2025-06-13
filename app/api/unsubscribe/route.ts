import { processUnsubscribe } from "@/usecases/email";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe/error?message=missing-token", req.url))
  }

  const result = await processUnsubscribe(token)
  if (result.isErr()) {
    switch(result.error._tag) {
      case "EXPIRED_UNSUBSCRIBE_LINK_ERROR":
        console.log(`[${result.error._tag}]`, result.error)
        break
      default:
        console.error(result.error)
        break
    }
    return NextResponse.redirect(new URL(`/newsletter/unsubscribe/error?message=${encodeURIComponent(result.error.message)}`, req.url))
  }

  return NextResponse.redirect(new URL(`/newsletter/unsubscribe/success`, req.url))
}