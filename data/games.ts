import 'server-only'
import { CACHE_KEYS } from '@/utils/constants'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getEntries } from '@/contentful/contentful'
import { TypeGameCategorySkeleton } from '@/contentful/Types/contentful-types'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { getNewEntries } from '@/lib/redis'

export const getGames = cache(unstable_cache(async (draftMode: boolean) => {
  const gameIdsPromise = getGameIds()
  const gamesPromise = INTERNAL_getGameData(draftMode)
  const [{ changedIds, draftIds, newIds }, games] = await Promise.all([gameIdsPromise, gamesPromise])
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
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const games = await INTERNAL_getGameData(draftMode)
  return games.filter(g => !g.fields.isComingSoon).map(g => ({
    id: g.sys.id,
    title: g.fields.title,
    slug: g.fields.slug
  }))
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const games = await INTERNAL_getGameData(draftMode)
  const game = games.find(g => g.sys.id === id)
  if (!game) return null

  return {
    id: game.sys.id,
    slug: game.fields.slug,
    isComingSoon: game.fields.isComingSoon ?? false,
  }
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

const getGameIds = cache(unstable_cache(async () => {
  const gamesPromise = getManagementEntries("gameCategory")
  const newEntriesPromise = getNewEntries()
  const [games, newEntries] = await Promise.all([gamesPromise, newEntriesPromise])
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
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

const INTERNAL_getGameData = cache(async (draftMode: boolean) => {
  return await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['-fields.releaseDate'],
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields"
    ]
  }, draftMode)
})