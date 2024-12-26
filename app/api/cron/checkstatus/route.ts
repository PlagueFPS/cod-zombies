import { headers } from "next/headers"
import { authorizedRequest } from "@/utils/functions"
import { env } from "@/env"
import { enforceNewMapStatus } from "@/data/featuredMaps"
import { enforceNewCategoryStatus } from "@/data/gameCategory"
import { submitFeedbackUseCase } from "@/usecases/feedback"

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization')

  if (!authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)) {
    await submitFeedbackUseCase({
      title: "Cron Job Auth Error",
      name: "Cron Job",
      label: "issue",
      feedback: "Auth failed, a secret somewhere is not configured correctly"
    })
    return Response.json({ success: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  try {
    const mapEnforce = enforceNewMapStatus()
    const categoryEnforce = enforceNewCategoryStatus()
    const [{ status: mapStatus }, { status: categoryStatus }] = await Promise.allSettled([mapEnforce, categoryEnforce])
    
    if (mapStatus === "rejected" && categoryStatus === "rejected") {
      throw new Error("Both map and category enforcement failed")
    } else if (mapStatus === "rejected") {
      throw new Error("Map enforcement failed")
    } else if (categoryStatus === "rejected") {
      throw new Error("category enforcement failed")
    }
  } 
  catch (error) {
    console.error("[CRON] Error in checkstatus cron job", error)
    await submitFeedbackUseCase({
      title: "Cron Job Error",
      name: "Cron Job",
      label: "issue",
      feedback: "Error in checkstatus cron job, check your logs"
    })
    return Response.json({ success: false }, { status: 500 })
  }

  console.log("[CRON] checkstatus cron job completed")
  return Response.json({ success: true }, { status: 200 })
}
