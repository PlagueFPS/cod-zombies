import 'server-only'
import { getEntries, getManagementEntries } from '@/contentful/contentful'
import { TypeSideQuestsSkeleton } from '@/contentful/Types/contentful-types'
import { CACHE_KEYS } from '@/utils/constants'
import {  
  createImageDTO, 
  createMapCategoryDTO, 
  createQuestMapDTO, 
  resolveAsset, 
  resolveEntry 
} from '@/utils/contentful-utils'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { Entry } from 'contentful'
import { getNewEntries } from '@/lib/redis'
import { CMS, CMSManagement } from '@/lib/services/CMS'
import { Cache } from '@/lib/services/Cache'
import { Array, Effect, Layer, Order } from 'effect'

const DataLayer = Layer.merge(CMSManagement.Default, Cache.Default)

export const getQuests = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*(){
    const quests = yield* INTERNAL_getSideQuestData()
    if (!quests) return []

    return yield* Effect.forEach(quests, (quest) => Effect.gen(function*(){
      const { category: game, ...rest } = yield* resolveQuestData(quest)
      return {
        ...rest,
        game,
        id: quest.sys.id,
        updatedAt: quest.sys.updatedAt,
        isComingSoon: quest.fields.isComingSoon ?? false,
        title: quest.fields.title,
        slug: quest.fields.slug,
        description: quest.fields.description,
      }
    }))
  }).pipe(
    Effect.withLogSpan("get_quests"),
    Effect.provide(DataLayer),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*() {
    const quests = yield* INTERNAL_getSideQuestData()
    if (!quests) return []

    const currentQuests = quests.filter(q => !q.fields.isComingSoon)

    return yield* Effect.forEach(currentQuests, (quest) => Effect.gen(function*(){
      const { category: game, map } = yield* resolveQuestData(quest)

      return {
        id: quest.sys.id,
        title: quest.fields.title,
        slug: quest.fields.slug,
        game,
        map
      }
    }), { concurrency: "unbounded" })
  }).pipe(
    Effect.withLogSpan("get_quest_search_data"),
    Effect.provide(DataLayer),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  return Effect.gen(function*() {
    const quests = yield* INTERNAL_getSideQuestData()
    if (!quests) return null

    const quest = quests.find(q => q.sys.id === id)
    if (!quest) return null

    return {
      id: quest.sys.id,
      slug: quest.fields.slug,
      title: quest.fields.title,
      description: quest.fields.description,
      image: createImageDTO(resolveAsset(quest.fields.image)),
      isComingSoon: quest.fields.isComingSoon ?? false,
      map: createQuestMapDTO(resolveEntry(quest.fields.map)).slug,
      game: createMapCategoryDTO(resolveEntry(quest.fields.game)).slug
    }
  }).pipe(
    Effect.withLogSpan("get_quest_by_id"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  return Effect.gen(function*() {
    const quests = yield* INTERNAL_getSideQuestData()
    if (!quests) return null

    const quest = quests.find(q => q.fields.slug === slug)
    if (!quest) return null

    const { category: game, ...rest } = yield* resolveQuestData(quest)
    return {
      ...rest,
      game,
      id: quest.sys.id,
      updatedAt: quest.sys.updatedAt,
      isComingSoon: quest.fields.isComingSoon ?? false,
      title: quest.fields.title,
      slug: quest.fields.slug,
      description: quest.fields.description,
      content: quest.fields.content,
      timeToRead: quest.fields.timeToRead,
    }
  }).pipe(
    Effect.withLogSpan("get_quest_by_slug"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

const resolveQuestData = (quest: Entry<TypeSideQuestsSkeleton, undefined, string>) => Effect.gen(function*(){
  const { changedIds, draftIds, newIds } = yield* getQuestIds()
  const image = createImageDTO(resolveAsset(quest.fields.image))
  const map = createQuestMapDTO(resolveEntry(quest.fields.map))
  const category = createMapCategoryDTO(resolveEntry(quest.fields.game))
  const isDraft = draftIds.has(quest.sys.id)
  const isChanged = changedIds.has(quest.sys.id)
  const isNew = newIds.has(quest.sys.id)

  return {
    image,
    map,
    category,
    isDraft,
    isChanged,
    isNew
  }
})

const getQuestIds = cache(() => Effect.gen(function*(){
  const [quests, newEntries] = yield* Effect.all([
    getManagementEntries("sideQuests"), 
    getNewEntries()
  ], { concurrency: "unbounded" })

  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  quests.forEach(quest => {
    if (!quest.sys.publishedVersion) {
      draftIds.add(quest.sys.id)
    } else if (!!quest.sys.publishedVersion && quest.sys.version >= quest.sys.publishedVersion + 2) {
      changedIds.add(quest.sys.id)
    }
  })

  newEntries.forEach(entry => {
    if (entry.type !== "sideQuest") return
    newIds.add(entry.entryId)
  })

  return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_quest_ids")))

const INTERNAL_getSideQuestData = cache(() => Effect.gen(function*() {
  const quests = yield* getEntries<TypeSideQuestsSkeleton>({
    content_type: "sideQuests",
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields"
    ],
    order: ["-sys.createdAt"]
  })

  if (!quests) return null

  const byMapDate = Order.mapInput(Order.Date, (quest: typeof quests[number]) => {
    const map = resolveEntry(quest.fields.map)
    if (!map) return new Date(quest.sys.createdAt)
    return new Date(map.fields.releaseDate)
  })

  return Array.sort(quests, Order.reverse(byMapDate))
}))