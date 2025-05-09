import type { NextRequest } from 'next/server'
import { getMapById } from '@/data/maps'
import { draftMode } from 'next/headers'
import { env } from '@/env'
import { authorizedRequest } from '@/utils/functions'
import { getQuestById } from '@/data/sideQuests'
import { getZombieById } from '@/data/zombies'
import { getLegalDocById } from '@/data/legal'
import type { AllowedSlugs } from '@/types/EntryEnforcement'

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

const DraftResponse = {
  notFound(type: string) {
    return new Response(`${type} not found`, { status: 404 })
  },
  async success(path: string) {
    const draft = await draftMode()
    draft.enable()
    return Response.redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}${path}`)
  },
  error(message: string, status: number = 400) {
    return new Response(message, { status })
  }
} as const

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const secret = req.nextUrl.searchParams.get('secret') || ''
  const entryId = req.nextUrl.searchParams.get('entryId')

  if (!entryId) return DraftResponse.error("Missing entryId")

  if (!authorizedRequest(secret, env.DRAFT_SECRET)) {
    return DraftResponse.error("Unauthorized Request", 401)
  }

  switch(slug[0] as AllowedSlugs) {
    case 'maps': {
      const map = await getMapById(true, entryId)
      if (!map) return DraftResponse.notFound("map")
      
      return await DraftResponse.success(`/${map.game}/${map.slug}`)
    }
    case 'side-quests': {
      const quest = await getQuestById(true, entryId)
      if (!quest) {
        return DraftResponse.notFound("quest")
      }

      return await DraftResponse.success(`/side-quests/${quest.game}/${quest.map}/${quest.slug}`)
    }
    case 'zombies': {
      const zombie = await getZombieById(true, entryId)
      if (!zombie) return DraftResponse.notFound("zombie")
      
      return await DraftResponse.success(`/bestiary/${zombie.slug}`)
    }
    case 'legal': {
      const doc = await getLegalDocById(true, entryId)
      if (!doc) return DraftResponse.notFound('legal')
      
      return await DraftResponse.success(`/${doc.slug}`)
    }
    default: {
      return DraftResponse.error("Invalid Slug")
    }
  }
}