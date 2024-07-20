"use server"
import { revalidateTag } from "next/cache"

// THIS SERVER ACTION IS ONLY FOR UPDATING CACHED DATA
// IN A DEVELOPMENT ENVIRONMENT, PRODUCTION DATA WILL BE
// REVALIDATED VIA A CONTENTFUL WEBHOOK at /api/revalidate
// THIS IS ONLY NEED SINCE UNSTABLE_CACHE IS STILL IN BETA
export async function updateData() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    console.log('Revalidating data...')
    revalidateTag('maps')
    revalidateTag('categories')
    console.log('Maps and Categories Revalidated')
  }
}