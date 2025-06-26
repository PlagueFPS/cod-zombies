import "server-only"
import { type EntriesQueries, type EntrySkeletonType } from 'contentful'
import { Effect } from "effect"
import { CMS, CMSManagement } from "@/lib/services/CMS"
import { GetEntriesError } from "@/types/Error"

export const getEntries = <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) => 
  Effect.gen(function*() {
    const cms = yield* CMS
    const data = yield* cms.getEntries<T>(searchParams)
    return data.items
  }).pipe(
    Effect.withLogSpan("get_entries"),
    Effect.tapError(Effect.logError),
    Effect.catchAll(() => Effect.succeed(null))
  )

export const getManagementEntries = (contentType: "featuredMaps" | "gameCategory" | "sideQuests" | "zombies") => 
  Effect.gen(function*() {
    const cms = yield* CMSManagement
    const data = yield* Effect.tryPromise({
      try: () => cms.client.entry.getMany({
        query: {
          content_type: contentType
        }
      }),
      catch: (error) => new GetEntriesError({
        message: "Failed to get management entries",
        cause: error
      })
    })

    return data.items
  }).pipe(
    Effect.withLogSpan("get_management_entries"),
    Effect.tapError(Effect.logError),
    Effect.catchAll(() => Effect.succeed([]))
  )