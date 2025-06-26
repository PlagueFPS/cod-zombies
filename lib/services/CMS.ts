import { GetEntriesError } from "@/types/Error";
import { createClient, EntrySkeletonType, EntriesQueries } from "contentful";
import management from "contentful-management"
import { Config, Effect, Redacted } from "effect";

export class CMS extends Effect.Service<CMS>()("CMS", {
  effect: (draftMode: boolean) => Effect.gen(function*() {
    const space = yield* Config.string("CONTENTFUL_SPACE_ID")
    const host = draftMode ? "preview.contentful.com" : "cdn.contentful.com"
    const accessToken = yield* draftMode 
      ? Config.redacted("CONTENTFUL_PREVIEW_ACCESS_TOKEN") 
      : Config.redacted("CONTENTFUL_ACCESS_TOKEN")

    const client = createClient({ 
      accessToken: Redacted.value(accessToken),
      space,
      host
    })

    const getEntries = <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) => 
      Effect.tryPromise({
        try: () => client.getEntries<T>(searchParams),
        catch: (error) => new GetEntriesError({ cause: error })
      })

    return { getEntries } as const
  }).pipe(
    Effect.withLogSpan("cms"),
    Effect.catchTags({
      ConfigError: (error) => Effect.die(error)
    })
  )
}){}

export class CMSManagement extends Effect.Service<CMSManagement>()("CMSManagement", {
  effect: Effect.gen(function*() {
    const spaceId = yield* Config.string("CONTENTFUL_SPACE_ID")
    const accessToken = yield* Config.redacted("CONTENTFUL_MANAGEMENT_ACCESS_TOKEN")

    const client = management.createClient({
      accessToken: Redacted.value(accessToken)
    }, { type: "plain", defaults: { spaceId, environmentId: "master" }})

    return { client } as const
  }).pipe(
    Effect.withLogSpan("cms_management"),
    Effect.catchTags({
      ConfigError: (error) => Effect.die(error)
    })
  )
}){}