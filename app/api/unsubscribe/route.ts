import { processUnsubscribe } from "@/usecases/email";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe/error?message=missing-token", req.url))
  }

  const result = await processUnsubscribe(token)
  if (!result.success) {
    return NextResponse.redirect(new URL(`/newsletter/unsubscribe/error?message=${encodeURIComponent(result.message)}`, req.url))
  }

  return NextResponse.redirect(new URL(`/newsletter/unsubscribe/success`, req.url))
}