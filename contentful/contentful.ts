import "server-only"
import { createClient, type EntriesQueries, type EntrySkeletonType } from 'contentful'
import { env } from "@/env"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { tryCatch } from "@/utils/functions"
import { UpstreamProviderError } from "@/types/Error"

export const prodClient = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_ACCESS_TOKEN,
  host: 'cdn.contentful.com'
})

export const previewClient = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com'
})

export const getEntries = async <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>, draftMode?: boolean,) => {
  const client = (draftMode || IN_DEVELOPMENT) ? previewClient : prodClient
  const { data, error } = await tryCatch(client.getEntries<T>(searchParams))
  if (error) {
    console.error(new UpstreamProviderError(`Contentful query failed with these query params: ${searchParams}`, { cause: error }))
    return []
  }

  return data.items
}