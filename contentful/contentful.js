import { createClient } from 'contentful'
import { env } from '@/utils/env'

export const client = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  environment: env.CONTENTFUL_ENVIRONMENT,
  accessToken: env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: env.CONTENTFUL_PREVIEW_HOSTNAME
})