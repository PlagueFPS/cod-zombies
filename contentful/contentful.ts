import "server-only"
import { IN_DEVELOPMENT } from '@/utils/constants'
import { createClient, type EntriesQueries, type EntrySkeletonType } from 'contentful'
import { env } from "@/env"

const initializeContentfulClient = (draftMode?: boolean) => {
  const space = env.CONTENTFUL_SPACE_ID
  const accessToken = (draftMode || IN_DEVELOPMENT) ? env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : env.CONTENTFUL_ACCESS_TOKEN
  const host = (draftMode || IN_DEVELOPMENT) ? 'preview.contentful.com' : 'cdn.contentful.com'

  return createClient({
    space,
    accessToken: accessToken,
    host
  })
}

export const getEntries = async <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>, draftMode?: boolean,) => {
  const client = initializeContentfulClient(draftMode)
  const response = await client.getEntries<T>(searchParams)
  return response
}