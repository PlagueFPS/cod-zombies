import type { NextRequest } from 'next/server'
import { getMapById } from '@/data/maps'
import { draftMode } from 'next/headers'
import { env } from '@/env'
import { authorizedRequest } from '@/utils/functions'
import { getQuestById } from '@/data/side-quests'
import { getZombieById } from '@/data/zombies'
import { getLegalDocById } from '@/data/legal'
import { AllowedSlugsSchema } from '@/utils/validation-schemas'
import { AuthorizationError, EntryNotFoundError, InvalidRequestError } from '@/types/Error'
import { Config, Effect, Redacted, Schema } from 'effect'

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

const createSuccessResponse = (path: string) => Effect.gen(function*(){
  const draft = yield* Effect.promise(() => draftMode())
  draft.enable()
  return Response.redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}${path}`)
})

export async function GET(req: NextRequest, { params }: RouteParams) {
  return Effect.gen(function*(){
    const { slug } = yield* Effect.promise(() => params)
    const secret = req.nextUrl.searchParams.get('secret')
    const entryId = req.nextUrl.searchParams.get('entryId')

    if (!secret) return yield* new InvalidRequestError({ message: "Missing secret" })
    if (!entryId) return yield* new InvalidRequestError({ message: "Missing entryId" })
    
    const revalidateSecret = yield* Config.redacted("REVALIDATE_SECRET")
    const providedSecret = Redacted.make(secret)

    const authed = yield* authorizedRequest(Redacted.value(providedSecret), Redacted.value(revalidateSecret))
    if (!authed) return yield* new AuthorizationError({ message: "Unauthorized Request" })
    
    const validSlug = yield* Schema.decodeUnknown(AllowedSlugsSchema)(slug[0])
    switch(validSlug) {
      case "maps": {
        const map = yield* Effect.promise(() => getMapById(true, entryId))
        if (!map) return yield* new EntryNotFoundError({ message: `No map found for entryId: ${entryId}` })
        
        return yield* createSuccessResponse(`/${map.game}/${map.slug}`)
      }
      case "side-quests": {
        const quest = yield* Effect.promise(() => getQuestById(true, entryId))
        if (!quest) return yield* new EntryNotFoundError({ message: `No quest found for entryId: ${entryId}` })
        
        return yield* createSuccessResponse(`/side-quests/${quest.game}/${quest.map}/${quest.slug}`)
      }
      case "zombies": {
        const zombie = yield* Effect.promise(() => getZombieById(true, entryId))
        if (!zombie) return yield* new EntryNotFoundError({ message: `No zombie found for entryId: ${entryId}` })
        
        return yield* createSuccessResponse(`/bestiary/${zombie.slug}`)
      }
      case "legal": {
        const doc = yield* Effect.promise(() => getLegalDocById(true, entryId))
        if (!doc) return yield* new EntryNotFoundError({ message: `No legal document found for entryId: ${entryId}` })
        
        return yield* createSuccessResponse(`/${doc.slug}`)
      }
      default: {
        return yield* new InvalidRequestError({ message: `No preview available for this slug: ${validSlug}` })
      }
    }
  }).pipe(
    Effect.withLogSpan("get_draft_handler"),
    Effect.tapError(Effect.logError),
    Effect.catchTags({
      AuthorizationError: (error) => Effect.succeed(Response.json(error.message, { status: 401 })),
      EntryNotFoundError: (error) => Effect.succeed(Response.json(error.message, { status: 404 })),
      InvalidRequestError: (error) => Effect.succeed(Response.json(error.message, { status: 400 })),
      ParseError: (error) => Effect.succeed(Response.json(error.message, { status: 400 })),
    }),
    Effect.catchAll((error) => Effect.succeed(Response.json(error.message, { status: 500 }))),
    Effect.runPromise
  )
}