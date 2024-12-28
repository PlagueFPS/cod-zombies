import 'server-only'
import { getEntries } from '@/contentful/contentful'
import { TypeSideQuestsSkeleton } from '@/contentful/Types/contentful-types'
import { CACHE_KEYS, MAP_LIMIT } from '@/utils/constants'
import { 
  calculateSkip, 
  createImageDTO, 
  createMapCategoryDTO, 
  createQuestMapDTO, 
  resolveAsset, 
  resolveEntry 
} from '@/utils/contentful-utils'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Entry } from 'contentful'
import { managementClient } from '@/contentful/contentfulManagement'

export const getPaginatedSideQuests = cache(unstable_cache(async (draftMode: boolean, page: number) => {
  const skip = calculateSkip(page, MAP_LIMIT)
  const sideQuests = await INTERNAL_getSideQuestData(draftMode)
  const paginatedQuests = sideQuests.slice(skip, (MAP_LIMIT * page))

  const sideQuestsDTO = await Promise.all(paginatedQuests.map(async quest => {
    const { category, image, isChanged, isDraft, map } = await resolveQuestData(quest)
    return {
      id: quest.sys.id,
      title: quest.fields.title,
      slug: quest.fields.slug,
      description: quest.fields.description,
      game: category,
      image,
      map,
      isChanged,
      isDraft
    }
  }))
  const totalPages = Math.ceil(sideQuests.length / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1

  return {
    sideQuests: sideQuestsDTO,
    totalQuests: sideQuestsDTO.length,
    totalPages,
    currentPage,
    prevPage,
    nextPage
  }
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

const getDraftsAndChanged = cache(unstable_cache(async () => {
  const quests = await managementClient.entry.getMany({
    query: {
      content_type: "sideQuests"
    }
  })
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()

  quests.items.forEach(quest => {
    if (!quest.sys.publishedVersion) {
      draftIds.add(quest.sys.id)
    } else if (!!quest.sys.publishedVersion && quest.sys.version >= quest.sys.publishedVersion + 2) {
      changedIds.add(quest.sys.id)
    }
  })

  return { draftIds, changedIds }
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

const resolveQuestData = cache(async (quest: Entry<TypeSideQuestsSkeleton, undefined, string>) => {
  const { changedIds, draftIds } = await getDraftsAndChanged()
  const image = createImageDTO(resolveAsset(quest.fields.image))
  const map = createQuestMapDTO(resolveEntry(quest.fields.map))
  const category = createMapCategoryDTO(resolveEntry(quest.fields.game))
  const isDraft = draftIds.has(quest.sys.id)
  const isChanged = changedIds.has(quest.sys.id)

  return {
    image,
    map,
    category,
    isDraft,
    isChanged
  }
})

const INTERNAL_getSideQuestData = cache(async (draftMode: boolean) => {
  const quests = await getEntries<TypeSideQuestsSkeleton>({
    content_type: 'sideQuests',
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields"
    ] 
  }, draftMode)

  return quests.items
})