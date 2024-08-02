import { createClient } from 'contentful'

export const initializeContentfulClient = (draftMode?: boolean) => {
  const space = process.env.CONTENTFUL_SPACE_ID ?? ''
  const accessToken = draftMode ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
  const host = draftMode ? 'preview.contentful.com' : 'cdn.contentful.com'

  return createClient({
    space,
    accessToken: accessToken ?? '',
    host
  })
}