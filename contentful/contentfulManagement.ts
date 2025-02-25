import 'server-only'
import { createClient } from 'contentful-management'
import { env } from '@/env'
import { tryCatch } from '@/utils/functions'

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

export const getManagementEntries = async (contentType: "featuredMaps" | "gameCategory" | "sideQuests") => {
  return await tryCatch(managementClient.entry.getMany({
    query: {
      content_type: contentType
    }
  }))
}