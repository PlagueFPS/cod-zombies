import 'server-only'
import { CACHE_KEYS } from '@/utils/constants'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getEntries, getManagementEntries } from '@/contentful/contentful'
import { TypeGameCategorySkeleton } from '@/contentful/Types/contentful-types'
import { getNewEntries } from '@/lib/redis'
import { CMS, CMSManagement } from '@/lib/services/CMS'
import { Cache } from '@/lib/services/Cache'
import { Effect, Layer } from 'effect'

const DataLayer = Layer.merge(CMSManagement.Default, Cache.Default)

export const getGames = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*() {
    const [games, { changedIds, draftIds, newIds }] = yield* Effect.all([
      INTERNAL_getGameData(), 
      getGameIds()
    ], { concurrency: "unbounded"})
    
    if (!games) return null
    return games.map(game => {
      const isDraft = draftIds.has(game.sys.id)
      const isChanged = changedIds.has(game.sys.id)
      const isNew = newIds.has(game.sys.id)
      return {
        id: game.sys.id,
        title: game.fields.title,
        slug: game.fields.slug,
        isComingSoon: game.fields.isComingSoon ?? false,
        isDraft,
        isChanged,
        isNew,
      }
    })
  }).pipe(
    Effect.withLogSpan("get_games"),
    Effect.provide(DataLayer),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*() {
    const games = yield* INTERNAL_getGameData()
    if (!games) return null
    return games.filter(g => !g.fields.isComingSoon).map(g => ({
      id: g.sys.id,
      title: g.fields.title,
      slug: g.fields.slug
    }))
  }).pipe(
    Effect.withLogSpan("get_game_search_data"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  return Effect.gen(function*() {
    const games = yield* INTERNAL_getGameData()
    if (!games) return null

    const game = games.find(g => g.sys.id === id)
    if (!game) return null

    return {
      id: game.sys.id,
      slug: game.fields.slug,
      isComingSoon: game.fields.isComingSoon ?? false,
    }
  }).pipe(
    Effect.withLogSpan("get_game_by_id"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

const getGameIds = cache(() => Effect.gen(function*() {
  const [games, newEntries] = yield* Effect.all([
    getManagementEntries("gameCategory"), 
    getNewEntries()
  ], { concurrency: "unbounded" })

  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  games.forEach(game => {
    if (!game.sys.publishedVersion) {
      draftIds.add(game.sys.id)
    } else if (!!game.sys.publishedVersion && game.sys.version >= game.sys.publishedVersion + 2) {
      changedIds.add(game.sys.id)
    }
  })

  newEntries.forEach(entry => {
    if (entry.type !== "game") return
    newIds.add(entry.entryId)
  })

  return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_game_ids")))

const INTERNAL_getGameData = cache(() => getEntries<TypeGameCategorySkeleton>({
  content_type: "gameCategory",
  order: ["-fields.releaseDate"],
  select: [
    "sys.id",
    "sys.updatedAt",
    "fields"
  ]
  }))