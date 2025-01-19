import type { NextRequest } from 'next/server'
import { getMapById } from '@/data/maps'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/env'
import { authorizedRequest } from '@/utils/functions'
 
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const entryId = req.nextUrl.searchParams.get('entryId')
 
  if (!authorizedRequest(secret, env.DRAFT_SECRET) || !entryId) {
    return new Response('Unauthorized Request', { status: 401 })
  }
 
  // Manually setting draftMode to true because we are trying to fetch draft content
  const map = await getMapById(true, entryId)
  // If the map doesn't exist prevent draft mode from being enabled
  if (!map) {
    return new Response('Invalid slug', { status: 401 })
  }
  // Enable Draft Mode by setting the cookie
  const draft = await draftMode()
  draft.enable()
  // Redirect to the path from the fetched map
  redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}/${map.category}/${map.slug}`)
}