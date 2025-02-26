import { headers } from "next/headers"
import { authorizedRequest } from "@/utils/functions"
import { env } from "@/env"
import { enforceNewMapStatus } from "@/data/maps"
import { enforceNewGameStatus } from "@/data/games"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { enforceNewQuestStatus } from "@/data/sideQuests"

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization') || ''

  if (!authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)) {
    await submitFeedbackUseCase({
      title: "Cron Job Auth Error",
      label: "issue",
      feedback: "Auth failed, a secret somewhere is not configured correctly"
    })
    return Response.json({ success: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const mapEnforce = enforceNewMapStatus()
  const gameEnforce = enforceNewGameStatus()
  const questEnforce = enforceNewQuestStatus()
  await Promise.all([mapEnforce, gameEnforce, questEnforce])

  console.log("[CRON] checkstatus cron job completed")
  return Response.json({ success: true }, { status: 200 })
}
