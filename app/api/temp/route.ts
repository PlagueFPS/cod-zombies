import { CACHE_KEYS } from "@/utils/constants";
import { authorizedRequest } from "@/utils/functions";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!authorizedRequest(secret, "P6LpedZKinvHAydi+L8vZ9a8fIxO1cYj/1fM9iWw558=")) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request'}, { status: 403 })
  }

  revalidateTag(`${CACHE_KEYS.FEATURED_MAPS.ALL}`)
  return Response.json({ revalidated: true, message: `Revalidated: ${CACHE_KEYS.FEATURED_MAPS.ALL}`}, { status: 200 })
}