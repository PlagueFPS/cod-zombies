import type { NextRequest } from 'next/server'
import { getMapBySlug } from '@/data/data'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/env'
 
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const slug = req.nextUrl.searchParams.get('slug')
 
  // This secret should only be known to this route handler and the CMS
  if (secret !== env.DRAFT_SECRET || !slug) {
    return new Response('Unauthorized Request', { status: 403 })
  }
 
  // Fetch the headless CMS to check if the provided `slug` exists
  const map = await getMapBySlug(slug)
  // If the slug doesn't exist prevent draft mode from being enabled
  if (!map) {
    return new Response('Invalid slug', { status: 401 })
  }
  const category = map.fields.gameCategory
  // Enable Draft Mode by setting the cookie
  draftMode().enable()
 
  // Redirect to the path from the fetched map
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}/${category?.fields.slug}/${map.fields.slug}`)
}