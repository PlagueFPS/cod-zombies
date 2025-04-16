import "server-only"
import type { TypeReferencedMapsSkeleton, TypeZombiesSkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { getEntries } from "@/contentful/contentful"
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
import { getManagementEntries } from "@/contentful/contentfulManagement"
import { tryCatch } from "@/utils/functions"
import { NEW_ENTRY_KV } from "@/lib/redis"

export const getZombies = cache(unstable_cache(async (draftMode: boolean) => {
  const zombiesPromise = INTERNAL_getZombies(draftMode)
  const zombieIdsPromise = getZombieIds()
  const [zombies, zombieIds] = await Promise.all([zombiesPromise, zombieIdsPromise])

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
    }
  })
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getZombieSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const zombiesPromise = INTERNAL_getZombies(draftMode)
  const zombieIdsPromise = getZombieIds()
  const [zombies, zombieIds] = await Promise.all([zombiesPromise, zombieIdsPromise])

  return zombies.map(zombie => {
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
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getZombieBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  const zombiesPromise = INTERNAL_getZombies(draftMode)
  const zombieIdsPromise = getZombieIds()
  const [zombies, zombieIds] = await Promise.all([zombiesPromise, zombieIdsPromise])

  const zombie = zombies.find(z => z.fields.slug === slug)
  if (!zombie) return null

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
  }
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getZombieById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const zombies = await INTERNAL_getZombies(draftMode)
  const zombie = zombies.find(z => z.sys.id === id)
  if (!zombie) return null
  
  return {
    slug: zombie.fields.slug
  }
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const getReferencedMaps = cache(unstable_cache(async (draftMode: boolean) => {
  const maps = await INTERNAL_getReferencedMaps(draftMode)
  return maps.map(map => ({...createQuestMapDTO(map), id: map.sys.id }))
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

export const storeNewZombieId = async (zombieId: string, createdAt: string) => {
  return await tryCatch(NEW_ENTRY_KV.set(zombieId, createdAt, "Published", "zombie"))
}

const getZombieIds = cache(unstable_cache(async () => {
  const zombiesPromise = getManagementEntries("zombies")
  const newEntriesPromise = tryCatch(NEW_ENTRY_KV.getAll())
  const [zombies, newEntries] = await Promise.all([zombiesPromise, newEntriesPromise])
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  if (zombies.error) {
    console.error(`Error getting management zombies`, zombies.error)
  }

  if (newEntries.error) {
    console.error(`Error getting new zombies`, newEntries.error)
  }

  zombies.data?.items.forEach(zombie => {
    if (!zombie.sys.publishedVersion) {
      draftIds.add(zombie.sys.id)
    } else if (!!zombie.sys.publishedVersion && zombie.sys.version >= zombie.sys.publishedVersion + 2) {
      changedIds.add(zombie.sys.id)
    }
  })

  newEntries.data?.forEach(entry => {
    if (entry.type !== "zombie") return
    newIds.add(entry.entryId)
  })

  return { newIds, draftIds, changedIds }
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

const resolveZombieData = cache((zombie: Entry<TypeZombiesSkeleton, undefined, string>, zombieIds: Awaited<ReturnType<typeof getZombieIds>>) => {
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
})

const INTERNAL_getZombies = cache(async (draftMode: boolean) => {
  const { data, error } = await getEntries<TypeZombiesSkeleton>({
    content_type: "zombies",
    order: ["-fields.releaseDate"],
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields",
    ],
  }, draftMode)

  if (error) {
    console.error(error)
    return []
  }

  return data.items
})

const INTERNAL_getReferencedMaps = cache(async (draftMode: boolean) => {
  const { data, error } = await getEntries<TypeReferencedMapsSkeleton>({
    content_type: "referencedMaps",
    order: ["-fields.releaseDate"],
  }, draftMode)

  if (error) {
    console.error(error)
    return []
  }

  return data.items
})