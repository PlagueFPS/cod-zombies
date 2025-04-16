import { headers } from "next/headers"
import { authorizedRequest, tryCatch } from "@/utils/functions"
import { env } from "@/env"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { NEW_ENTRY_KV } from "@/lib/redis"
import { CACHE_KEYS, MAX_NEW_TIME, MAX_QUEST_NEW_TIME } from "@/utils/constants"
import { revalidateTag } from "next/cache"
import { EntryType } from "@/types/EntryEnforcement"

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

  const { data, error } = await tryCatch(NEW_ENTRY_KV.getAll())
  if (error || !data) {
    console.error(`[STATUS ENFORCEMENT] Error getting new entries. Check server logs for more information.`, error)
    await submitFeedbackUseCase({
      title: "Status Enforcement Error",
      label: "issue",
      feedback: `Error getting new entries. Check server logs for more information.`
    })
    return Response.json({ sucess: false, message: error.message }, { status: 500 })
  }
  
  const idsToDelete: string[] = []
  const typesToRevalidate: EntryType[] = []

  data.forEach(async entry => {
    const currentTime = Date.now()
    const publishedTime = new Date(entry.createdAt).getTime()
    const ttl = entry.type === "sideQuest" ? MAX_QUEST_NEW_TIME : MAX_NEW_TIME

    if (currentTime - publishedTime > ttl) {
      idsToDelete.push(entry.entryId)
      typesToRevalidate.push(entry.type)
    }
  })

  if (idsToDelete.length > 0) {
      console.log(`[STATUS ENFORCEMENT] Deleting ${idsToDelete.length} entries from KV...`)
      const { error } = await tryCatch(NEW_ENTRY_KV.delAll(idsToDelete))
      
      if (error) {
        console.error(error)
        await submitFeedbackUseCase({
          title: "Status Enforcement Error",
          label: "issue",
          feedback: `Error deleting entries. Check server logs for more information.`
        })
      }

      if (typesToRevalidate.includes("mainQuest")) {
        console.log(`[STATUS ENFORCEMENT] Revalidating main quests...`) 
        revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
      }
      if (typesToRevalidate.includes("sideQuest")) {
        console.log(`[STATUS ENFORCEMENT] Revalidating side quests...`)
        revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
      }
      if (typesToRevalidate.includes("game")) {
        console.log(`[STATUS ENFORCEMENT] Revalidating game categories...`)
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      }
      if (typesToRevalidate.includes("zombie")) {
        console.log(`[STATUS ENFORCEMENT] Revalidating zombies...`)
        revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
      }
  }

  console.log("[CRON] checkstatus cron job completed")
  return Response.json({ success: true }, { status: 200 })
}
