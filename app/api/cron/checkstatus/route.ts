import { headers } from "next/headers"
import { authorizedRequest, tryCatch } from "@/utils/functions"
import { env } from "@/env"
import { submitFeedback } from "@/usecases/feedback"
import { NEW_ENTRY_KV } from "@/lib/redis"
import { CACHE_KEYS, MAX_NEW_TIME, MAX_QUEST_NEW_TIME } from "@/utils/constants"
import { revalidateTag } from "next/cache"
import { EntryType } from "@/types/EntryEnforcement"
import { StatusEnforcementError } from "@/types/Error"

const REVALIDATION_MAP: Record<EntryType, string> = {
  mainQuest: CACHE_KEYS.FEATURED_MAPS.ALL,
  game: CACHE_KEYS.GAME_CATEGORIES.ALL,
  sideQuest: CACHE_KEYS.SIDE_QUESTS.ALL,
  zombie: CACHE_KEYS.ZOMBIES.ALL,
  legal: CACHE_KEYS.LEGAL.ALL,
} as const

export async function GET() {
  const headersList = await headers()
  const secret = headersList.get('Authorization') || ''
  const authResult = authorizedRequest(secret, `Bearer ${env.CRON_SECRET}`)

  if (authResult.isErr()) {
    console.error(authResult.error)
    await submitFeedback({
      title: "Cron Job Auth Error",
      label: "issue",
      feedback: authResult.error.message
    })
    return new Response(authResult.error.message, { status: 401 })
  }

  const { data, error } = await tryCatch(NEW_ENTRY_KV.getAll())
  if (error || !data) {
    const statusError = new StatusEnforcementError(`Error getting new entries`, { cause: error })
    console.error(statusError)
    await submitFeedback({
      title: "Status Enforcement Error",
      label: "issue",
      feedback: statusError.message
    })
    return new Response(statusError.message, { status: 500 })
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
    const { data, error } = await tryCatch(NEW_ENTRY_KV.delAll([...idsToDelete]))      
    if (error || !data) {
      const statusError = new StatusEnforcementError(`Error deleting entries`, { cause: error })
      console.error(statusError)
      await submitFeedback({
        title: "Status Enforcement Error",
        label: "issue",
        feedback: statusError.message
      })
      return new Response(statusError.message, { status: 500 })
    }

    console.log(`[STATUS ENFORCEMENT] Deleted ${data}/${idsToDelete.size} entries from KV.`)
    typesToRevalidate.forEach(type => {
      const cacheKey = REVALIDATION_MAP[type]
      if (cacheKey) {
        revalidateTag(cacheKey)
        console.log(`[STATUS ENFORCEMENT] Revalidated ${type} data.`)
      }
    })
  }

  console.log("[STATUS ENFORCEMENT] checkstatus cron job completed")
  return new Response("ok", { status: 200 })
}
