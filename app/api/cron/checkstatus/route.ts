import { headers } from "next/headers"
import { authorizedRequest } from "@/utils/functions"
import { env } from "@/env"
import { enforceNewCategoryStatus, enforceNewMapStatus } from "@/data/kv"

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization')

  if (!authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)) {
    return Response.json({ success: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  try {
    await enforceNewMapStatus()
    await enforceNewCategoryStatus()
  } 
  catch (error) {
    console.error("[CRON] Error in checkstatus cron job", error)
    return Response.json({ success: false }, { status: 500 })
  }

  console.log("[CRON] checkstatus cron job completed")
  return Response.json({ success: true }, { status: 200 })
}
