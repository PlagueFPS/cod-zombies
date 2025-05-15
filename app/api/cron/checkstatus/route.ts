import { headers } from "next/headers"
import { authorizedRequest, tryCatch } from "@/utils/functions"
import { env } from "@/env"
import { submitFeedbackUseCase } from "@/usecases/feedback"
import { NEW_ENTRY_KV } from "@/lib/redis"
import { CACHE_KEYS, MAX_NEW_TIME, MAX_QUEST_NEW_TIME } from "@/utils/constants"
import { revalidateTag } from "next/cache"
import { EntryType } from "@/types/EntryEnforcement"

const REVALIDATION_MAP: Record<EntryType, string> = {
  mainQuest: CACHE_KEYS.FEATURED_MAPS.ALL,
  game: CACHE_KEYS.GAME_CATEGORIES.ALL,
  sideQuest: CACHE_KEYS.SIDE_QUESTS.ALL,
  zombie: CACHE_KEYS.ZOMBIES.ALL,
  legal: CACHE_KEYS.LEGAL.ALL,
}

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization') || ''

  if (!authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)) {
    await submitFeedbackUseCase({
      title: "Cron Job Auth Error",
      label: "issue",
      feedback: "Auth failed, a secret somewhere is not configured correctly"
    })
    return new Response("Unauthorized Request", { status: 401 })
  }

  const { data, error } = await tryCatch(NEW_ENTRY_KV.getAll())
  if (error || !data) {
    console.error(`[STATUS ENFORCEMENT] Error getting new entries:`, error)
    await submitFeedbackUseCase({
      title: "Status Enforcement Error",
      label: "issue",
      feedback: `Error getting new entries. Check server logs for more information.`
    })
    return new Response(error.message, { status: 500 })
  }
  
  const idsToDelete: Set<string> = new Set([])
  const typesToRevalidate: Set<EntryType> = new Set([])

  data.forEach(entry => {
    const currentTime = Date.now()
    const publishedTime = new Date(entry.createdAt).getTime()
    const ttl = entry.type === "sideQuest" ? MAX_QUEST_NEW_TIME : MAX_NEW_TIME

    if (currentTime - publishedTime > ttl) {
      idsToDelete.add(entry.entryId)
      typesToRevalidate.add(entry.type)
    }
  })

  if (idsToDelete.size > 0) {
    const { error } = await tryCatch(NEW_ENTRY_KV.delAll([...idsToDelete]))      
    if (error) {
      console.error(`[STATUS ENFORCEMENT] Error deleting entries`, error)
      await submitFeedbackUseCase({
        title: "Status Enforcement Error",
        label: "issue",
        feedback: `Error deleting entries. Check server logs for more information.`
      })
    }
    console.log(`[STATUS ENFORCEMENT] Deleted ${idsToDelete.size} entries from KV.`)

    typesToRevalidate.forEach(type => {
      const cacheKey = REVALIDATION_MAP[type]
      if (cacheKey) {
        revalidateTag(cacheKey)
        console.log(`[STATUS ENFORCEMENT] Revalidated ${type} data.`)
      }
    })
  }

  console.log("[CRON] checkstatus cron job completed")
  return new Response("ok", { status: 200 })
}
