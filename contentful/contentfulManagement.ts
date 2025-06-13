import 'server-only'
import { createClient } from 'contentful-management'
import { env } from '@/env'
import { tryCatch } from '@/utils/functions'
import { UpstreamProviderError } from '@/types/Error'

export const managementClient = createClient({
  accessToken: env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
}, 
{ 
  type: "plain", 
  defaults: {
    spaceId: env.CONTENTFUL_SPACE_ID,
    environmentId: 'master'
  }
})

export const getManagementEntries = async (contentType: "featuredMaps" | "gameCategory" | "sideQuests" | "zombies") => {
  const { data, error } = await tryCatch(managementClient.entry.getMany({
    query: {
      content_type: contentType
    }
  }))

  if (error) {
    console.error(new UpstreamProviderError(`Contentful management failed with a query for ${contentType}`, { cause: error }))
    return []
  }

  return data.items
}