import "server-only"
import type { TypeReferencedMapsSkeleton, TypeZombiesSkeleton } from "@/contentful/Types/contentful-types"
import type { Entry } from "contentful"
import { getEntries } from "@/contentful/contentful"
import { cache } from "react"
import { 
  createImageDTO, 
  createMapCategoryDTO, 
  createQuestMapDTO, 
  resolveAsset, 
  resolveEntry 
} from "@/utils/contentful-utils"
import { CACHE_KEYS } from "@/utils/constants"
import { unstable_cache } from "next/cache"

export const getZombies = cache(async (draftMode: boolean) => {
  const zombies = await INTERNAL_getZombies(draftMode)

  return zombies.map(zombie => {
    const zombieData = resolveZombieData(zombie)
    return {
      ...zombieData,
      id: zombie.sys.id,
      name: zombie.fields.name,
      slug: zombie.fields.slug,
      description: zombie.fields.description,
      type: zombie.fields.type,
      updatedAt: zombie.sys.updatedAt,
    }
  })
})

export const getZombieSearchData = cache(async (draftMode: boolean) => {
  const zombies = await INTERNAL_getZombies(draftMode)

  return zombies.map(zombie => {
    const { games, maps } = resolveZombieData(zombie)
    return {
      id: zombie.sys.id,
      name: zombie.fields.name,
      slug: zombie.fields.slug,
      type: zombie.fields.type,
      games,
      maps
    }
  })
})

export const getReferencedMaps = cache(unstable_cache(async (draftMode: boolean) => {
  const maps = await INTERNAL_getReferencedMaps(draftMode)
  return maps.map(map => ({...createQuestMapDTO(map), id: map.sys.id }))
}, [], {
  tags: [CACHE_KEYS.ZOMBIES.ALL]
}))

const resolveZombieData = cache((zombie: Entry<TypeZombiesSkeleton, undefined, string>) => {
  const image = createImageDTO(resolveAsset(zombie.fields.image))
  const games = zombie.fields.games.map(game => createMapCategoryDTO(resolveEntry(game)))
  const maps = zombie.fields.maps.map(map => createQuestMapDTO(resolveEntry(map)))

  return {
    image,
    games,
    maps
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