import { headers } from "next/headers"
import { authorizedRequest } from "@/utils/functions"
import { env } from "@/env"
import { enforceNewMapStatus } from "@/data/maps"
import { enforceNewGameStatus } from "@/data/games"
import { submitFeedbackUseCase } from "@/usecases/feedback"

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization')

  if (!authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)) {
    await submitFeedbackUseCase({
      title: "Cron Job Auth Error",
      label: "issue",
      feedback: "Auth failed, a secret somewhere is not configured correctly"
    })
    return Response.json({ success: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  try {
    const mapEnforce = enforceNewMapStatus()
    const categoryEnforce = enforceNewGameStatus()
    const [{ status: mapStatus }, { status: categoryStatus }] = await Promise.allSettled([mapEnforce, categoryEnforce])
    
    if (mapStatus === "rejected" && categoryStatus === "rejected") {
      throw new Error("[CRON] Both map and category enforcement failed")
    } else if (mapStatus === "rejected") {
      throw new Error("[CRON] Map enforcement failed")
    } else if (categoryStatus === "rejected") {
      throw new Error("[CRON] category enforcement failed")
    }
  } 
  catch (error) {
    console.error("[CRON] Error in checkstatus cron job", error)
    await submitFeedbackUseCase({
      title: "Cron Job Error",
      label: "issue",
      feedback: "Error in checkstatus cron job, check your logs"
    })
    return Response.json({ success: false }, { status: 500 })
  }

  console.log("[CRON] checkstatus cron job completed")
  return Response.json({ success: true }, { status: 200 })
}
