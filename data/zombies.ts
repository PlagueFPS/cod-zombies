import "server-only"
import type { TypeReferencedMapsSkeleton, TypeZombiesSkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { getEntries, getManagementEntries } from "@/contentful/contentful"
import { cache } from "react"
import {
  createImageDTO, 
  createItemTooltipDTO, 
  createMapCategoryDTO, 
  createQuestMapDTO, 
  createZombieAttackDTO, 
  resolveAsset, 
  resolveEntry 
} from "@/utils/contentful-utils"
import { CACHE_KEYS } from "@/utils/constants"
import { unstable_cache } from "next/cache"
import { getNewEntries } from "@/lib/redis"
import { CMS, CMSManagement } from "@/lib/services/CMS"
import { Cache } from "@/lib/services/Cache"
import { Effect, Layer } from "effect"

export type Zombie = NonNullable<Awaited<ReturnType<typeof getZombieBySlug>>>
export type MinifiedZombie = Awaited<ReturnType<typeof getZombies>>[number]
export type ZombieType = "Boss" | "Special" | "Elite" | "Normal"

const DataLayer = Layer.merge(CMSManagement.Default, Cache.Default)

export const getZombies = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*(){
    const zombies = yield* INTERNAL_getZombies()
    if (!zombies) return []
  
    const zombieIds = yield* getZombieIds

    return zombies.map(zombie => {
      const { elementalWeakness, attacks, ...rest } = resolveZombieData(zombie, zombieIds)
      return {
        ...rest,
        id: zombie.sys.id,
        name: zombie.fields.name,
        slug: zombie.fields.slug,
        description: zombie.fields.description,
        type: zombie.fields.type,
        updatedAt: zombie.sys.updatedAt,
        isComingSoon: zombie.fields.isComingSoon ?? false,
      }
    })
  }).pipe(
    Effect.withLogSpan("get_zombies"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getZombieSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*(){
    const zombies = yield* INTERNAL_getZombies()
    if (!zombies) return []

    const currentZombies = zombies.filter(z => !z.fields.isComingSoon)
    const zombieIds = yield* getZombieIds

    return currentZombies.map(zombie => {
      const { games, maps } = resolveZombieData(zombie, zombieIds)
      return {
        id: zombie.sys.id,
        name: zombie.fields.name,
        slug: zombie.fields.slug,
        type: zombie.fields.type,
        games,
        maps
      }
    })
  }).pipe(
    Effect.withLogSpan("get_zombie_search_data"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getZombieBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  return Effect.gen(function*(){
    const zombies = yield* INTERNAL_getZombies()
    if (!zombies) return null

    const zombie = zombies.find(z => z.fields.slug === slug)
    if (!zombie) return null
  
    const zombieIds = yield* getZombieIds
    const zombieData = resolveZombieData(zombie, zombieIds)
    return {
      ...zombieData,
      id: zombie.sys.id,
      slug: zombie.fields.slug,
      name: zombie.fields.name,
      description: zombie.fields.description,
      type: zombie.fields.type,
      updatedAt: zombie.sys.updatedAt,
      weakPoints: zombie.fields.weakPoints,
      speed: zombie.fields.speed,
      spawnBehavior: zombie.fields.spawnBehavior,
      combatStrategy: zombie.fields.combatStrategy,
      isComingSoon: zombie.fields.isComingSoon ?? false,
    }
  }).pipe(
    Effect.withLogSpan("get_zombie_by_slug"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.provide(DataLayer),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getZombieById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  return Effect.gen(function*(){
    const zombies = yield* INTERNAL_getZombies()
    if (!zombies) return null
    const zombie = zombies.find(z => z.sys.id === id)
    if (!zombie) return null
  
    return {
      id: zombie.sys.id,
      title: zombie.fields.name,
      slug: zombie.fields.slug,
      type: zombie.fields.type,
      description: zombie.fields.description,
      image: createImageDTO(resolveAsset(zombie.fields.image)),
      isComingSoon: zombie.fields.isComingSoon ?? false,
    }
  }).pipe(
    Effect.withLogSpan("get_zombie_by_id"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getReferencedMaps = cache(unstable_cache(async (draftMode: boolean) => {
  return Effect.gen(function*(){
    const maps = yield* INTERNAL_getReferencedMaps()
    if (!maps) return []
    return maps.map(map => ({...createQuestMapDTO(map), id: map.sys.id }))
  }).pipe(
    Effect.withLogSpan("get_referenced_maps"),
    Effect.provide(CMS.Default(draftMode)),
    Effect.runPromise
  )
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

const resolveZombieData = (zombie: Entry<TypeZombiesSkeleton, undefined, string>, zombieIds: Effect.Effect.Success<typeof getZombieIds>) => {
  const { changedIds, draftIds, newIds } = zombieIds
  const image = createImageDTO(resolveAsset(zombie.fields.image))
  const games = zombie.fields.games.map(game => createMapCategoryDTO(resolveEntry(game)))
  const maps = zombie.fields.maps.map(map => createQuestMapDTO(resolveEntry(map)))
  const attacks = zombie.fields.attacks.map(attack => createZombieAttackDTO(resolveEntry(attack)))
  const elementalWeakness = zombie.fields.elementalWeakness?.map(weakness => {
    const item = resolveEntry(weakness)
    if (!item) return
    return createItemTooltipDTO(item)
  }).filter(weakness => !!weakness)

  const isDraft = draftIds.has(zombie.sys.id)
  const isChanged = changedIds.has(zombie.sys.id)
  const isNew = newIds.has(zombie.sys.id)

  return {
    image,
    games,
    maps,
    attacks,
    elementalWeakness,
    isDraft,
    isChanged,
    isNew
  }
}

const getZombieIds = Effect.gen(function*(){
  const [zombies, newEntries] = yield* Effect.all([
    getManagementEntries("zombies"), 
    getNewEntries()
  ], { concurrency: "unbounded" })

  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  zombies.forEach(zombie => {
    if (!zombie.sys.publishedVersion) {
      draftIds.add(zombie.sys.id)
    } else if (!!zombie.sys.publishedVersion && zombie.sys.version >= zombie.sys.publishedVersion + 2) {
      changedIds.add(zombie.sys.id)
    }
  })

  newEntries.forEach(entry => {
    if (entry.type !== "zombie") return
    newIds.add(entry.entryId)
  })

  return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_zombie_ids"))

const INTERNAL_getZombies = cache(() => getEntries<TypeZombiesSkeleton>({
    content_type: "zombies",
    order: ["-fields.releaseDate"],
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields",
    ],
  }))

const INTERNAL_getReferencedMaps = cache(() => getEntries<TypeReferencedMapsSkeleton>({
    content_type: "referencedMaps",
    order: ["-fields.releaseDate"],
  }))