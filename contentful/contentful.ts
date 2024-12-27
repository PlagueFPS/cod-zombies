import "server-only"
import { createClient, type EntriesQueries, type EntrySkeletonType } from 'contentful'
import { env } from "@/env"
import { IN_DEVELOPMENT } from "@/utils/constants"

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
  const response = await client.getEntries<T>(searchParams)
  return response
}

export const getEntry = async <T extends EntrySkeletonType>(entryId: string, draftMode?: boolean) => {
  const client = (draftMode || IN_DEVELOPMENT) ? previewClient : prodClient
  const entry = await client.getEntry<T>(entryId)
  return entry
}