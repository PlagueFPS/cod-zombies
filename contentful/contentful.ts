import "server-only"
import { IN_DEVELOPMENT } from '@/utils/constants'
import { createClient } from 'contentful'
import { env } from "@/env"

export const initializeContentfulClient = (draftMode?: boolean) => {
  const space = env.CONTENTFUL_SPACE_ID
  const accessToken = (draftMode || IN_DEVELOPMENT) ? env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : env.CONTENTFUL_ACCESS_TOKEN
  const host = (draftMode || IN_DEVELOPMENT) ? 'preview.contentful.com' : 'cdn.contentful.com'

  return createClient({
    space,
    accessToken: accessToken,
    host
  })
}