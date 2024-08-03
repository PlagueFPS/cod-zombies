// route handler with secret and slug
import { getMapBySlug } from '@/data/data'
import { resolveEntry } from '@/utils/contentful-utils'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { WEBSITE_URL } from '@/utils/constants'
 
export async function GET(request: Request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
 
  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.DRAFT_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }
 
  // Fetch the headless CMS to check if the provided `slug` exists
  const map = await getMapBySlug(slug)
  // If the slug doesn't exist prevent draft mode from being enabled
  if (!map) {
    return new Response('Invalid slug', { status: 401 })
  }
  const category = resolveEntry(map.fields.gameCategory)
  // Enable Draft Mode by setting the cookie
  draftMode().enable()
 
  // Redirect to the path from the fetched map
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(`${WEBSITE_URL}/${category?.fields.slug}/${map.fields.slug}`)
}