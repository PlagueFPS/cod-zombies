import { processSubscribe } from "@/usecases/email";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent("missing-token")}`, req.url))
  }

  const decodedToken = decodeURIComponent(token)
  const result = await processSubscribe(decodedToken)
  if (result.isErr()) {
    switch(result.error._tag) {
      case "EXPIRED_SUBSCRIBE_LINK_ERROR":
        console.warn(`[${result.error._tag}]`, result.error)
        break
      default:
        console.error(result.error)
        break
    }
    return NextResponse.redirect(new URL(`/newsletter/subscribe/error?message=${encodeURIComponent(result.error.message)}`, req.url))
  }

  return NextResponse.redirect(new URL(`/newsletter/subscribe/success`, req.url))
}