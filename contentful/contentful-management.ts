import 'server-only'
import { createClient } from 'contentful-management'
import { serverEnv } from '@/env/server'

export const managementClient = createClient({
  accessToken: serverEnv.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
}, 
{ 
  type: "plain", 
  defaults: {
    spaceId: serverEnv.CONTENTFUL_SPACE_ID,
    environmentId: 'master'
  }
})