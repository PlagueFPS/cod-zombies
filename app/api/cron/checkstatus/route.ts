import { headers } from "next/headers"
import { authorizedRequest } from "@/utils/functions"
import { NEW_ENTRY_KV } from "@/lib/redis"
import { CACHE_KEYS, MAX_NEW_TIME, MAX_QUEST_NEW_TIME } from "@/utils/constants"
import { revalidateTag } from "next/cache"
import { EntryType } from "@/types/EntryEnforcement"
import { Duration, Effect, Redacted } from "effect"
import { Cache } from "@/lib/services/Cache"
import { AuthorizationError } from "@/types/Error"
import { env } from "@/env"

const REVALIDATION_MAP: Record<EntryType, string> = {
  mainQuest: CACHE_KEYS.FEATURED_MAPS.ALL,
  game: CACHE_KEYS.GAME_CATEGORIES.ALL,
  sideQuest: CACHE_KEYS.SIDE_QUESTS.ALL,
  zombie: CACHE_KEYS.ZOMBIES.ALL,
  legal: CACHE_KEYS.LEGAL.ALL,
} as const

export async function GET() {
  return Effect.gen(function*() {
    const headerList = yield* Effect.promise(() => headers())
    const secret = headerList.get("Authorization")
    if (!secret) return yield* new AuthorizationError({ message: "Missing Auth Header" })

    const cronSecret = Redacted.make(env.CRON_SECRET)
    const providedSecret = Redacted.make(secret)

    const authed = yield* authorizedRequest(Redacted.value(providedSecret), `Bearer ${Redacted.value(cronSecret)}`)
    if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })

    const newEntries = yield* NEW_ENTRY_KV.getAll()
    const idsToDelete: Set<string> = new Set([])
    const typesToRevalidate: Set<EntryType> = new Set([])

    newEntries.forEach(entry => {
      const currentTime = Date.now()
      const publishedTime = entry.createdAt.getTime()
      const passedTime = Duration.subtract(currentTime, publishedTime).pipe(Duration.toMillis)
      const ttl = Duration.toMillis(entry.type === "sideQuest" ? MAX_QUEST_NEW_TIME : MAX_NEW_TIME)

      if (Duration.greaterThan(passedTime, ttl)) {
        idsToDelete.add(entry.entryId)
        typesToRevalidate.add(entry.type)
      }
    })

    if (idsToDelete.size > 0) yield* NEW_ENTRY_KV.del([...idsToDelete])
    
    typesToRevalidate.forEach(type => {
      const cacheKey = REVALIDATION_MAP[type]
      if (cacheKey) {
        revalidateTag(cacheKey)
        console.log(`[STATUS ENFORCEMENT] Revalidated ${type} data.`)
      }
    })
    
    return new Response("ok", { status: 200 })
  }).pipe(
    Effect.withLogSpan("status_enforcement_cron"),
    Effect.tapError(Effect.logError),
    Effect.catchTags({
      AuthorizationError: (error) => Effect.succeed(new Response(error.message, { status: 401 })),
    }),
    Effect.catchAll(error => Effect.succeed(new Response(error.message, { status: 500 }))),
    Effect.provide(Cache.Default),
    Effect.runPromise
  )
}
