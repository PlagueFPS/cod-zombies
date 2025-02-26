import type { NextRequest } from 'next/server'
import { getMapById } from '@/data/maps'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/env'
import { authorizedRequest } from '@/utils/functions'
import { getQuestById } from '@/data/sideQuests'

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const secret = req.nextUrl.searchParams.get('secret') || ''
  const entryId = req.nextUrl.searchParams.get('entryId')
  console.log(`Contentful Headers: ${req.headers}`)

  if (!entryId) return new Response('Missing entryId', { status: 400 })

  if (!authorizedRequest(secret, env.DRAFT_SECRET)) {
    return new Response('Unauthorized Request', { status: 401 })
  }

  switch(slug[0]) {
    case 'maps': {
      const map = await getMapById(true, entryId)
      if (!map) {
        return new Response('Map not found', { status: 404 })
      }

      const draft = await draftMode()
      draft.enable()
      redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game}/${map.slug}`)
    }
    case 'side-quests': {
      const quest = await getQuestById(true, entryId)
      if (!quest) {
        return new Response('Quest not found', { status: 404 })
      }

      const draft = await draftMode()
      draft.enable()
      redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${quest.game}/${quest.map}/${quest.slug}`)
    }
    default: {
      return new Response("Invalid Slug", { status: 400 })
    }
  }
}