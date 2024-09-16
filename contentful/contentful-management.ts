import 'server-only'
import { createClient } from 'contentful-management'
import { env } from '@/env'

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