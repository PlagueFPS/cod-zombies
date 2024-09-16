import "server-only"
import { IN_DEVELOPMENT } from '@/utils/constants'
import { createClient } from 'contentful'
import { serverEnv } from "@/env/server"

export const initializeContentfulClient = (draftMode?: boolean) => {
  const space = serverEnv.CONTENTFUL_SPACE_ID
  const accessToken = (draftMode || IN_DEVELOPMENT) ? serverEnv.CONTENTFUL_PREVIEW_ACCESS_TOKEN : serverEnv.CONTENTFUL_ACCESS_TOKEN
  const host = (draftMode || IN_DEVELOPMENT) ? 'preview.contentful.com' : 'cdn.contentful.com'

  return createClient({
    space,
    accessToken: accessToken,
    host
  })
}