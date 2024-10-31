import { CACHE_KEYS } from "@/utils/constants";
import { revalidateTag } from "next/cache";

export function GET() {
  revalidateTag(`${CACHE_KEYS.FEATURED_MAPS.ALL}`)
  return Response.json({ revalidated: true, message: `Revalidated: ${CACHE_KEYS.FEATURED_MAPS.ALL}`}, { status: 200 })
}