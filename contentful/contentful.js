import { createClient } from 'contentful'

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_PREVIEW_HOSTNAME
})