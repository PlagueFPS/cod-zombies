import 'server-only'
import { createClient } from 'contentful-management'

export const managementClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!,
}, 
{ 
  type: "plain", 
  defaults: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    environmentId: 'master'
  }
})