import 'server-only'
import { getEntries } from '@/contentful/contentful'
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
import { Entry } from 'contentful'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { tryCatch } from '@/utils/functions'
import { NEW_ENTRY_KV } from '@/lib/redis'

export const getQuests = cache(unstable_cache(async (draftMode: boolean) => {
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getQuestIds()
  const [quests, questIds] = await Promise.all([questsPromise, questIdsPromise])
  return await Promise.all(quests.map(async q => {
    const { category: game, ...rest } = await resolveQuestData(q, questIds)
    return {
      ...rest,
      id: q.sys.id,
      updatedAt: q.sys.updatedAt,
      isComingSoon: q.fields.isComingSoon ?? false,
      title: q.fields.title,
      slug: q.fields.slug,
      description: q.fields.description,
      game,
    }
  }))
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getQuestIds()
  const [quests, questIds] = await Promise.all([questsPromise, questIdsPromise])
  return await Promise.all(quests.filter(q => !q.fields.isComingSoon).map(async q => {
    const { category: game, map } = await resolveQuestData(q, questIds)
    return {
      id: q.sys.id,
      title: q.fields.title,
      slug: q.fields.slug,
      game,
      map
    }
  }))
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const quests = await INTERNAL_getSideQuestData(draftMode)
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
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getQuestIds()
  const [quests, questIds] = await Promise.all([questsPromise, questIdsPromise])
  const q = quests.find(q => q.fields.slug === slug)
  if (!q) return null
  const { category: game, ...rest } = await resolveQuestData(q, questIds)
  return {
    ...rest,
    id: q.sys.id,
    updatedAt: q.sys.updatedAt,
    isComingSoon: q.fields.isComingSoon ?? false,
    title: q.fields.title,
    slug: q.fields.slug,
    description: q.fields.description,
    content: q.fields.content,
    timeToRead: q.fields.timeToRead,
    game
  }
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const storeNewQuestId = async (id: string, createdAt: string) => {
  return await tryCatch(NEW_ENTRY_KV.set(id, createdAt, "Published", "sideQuest"))
}

export const getQuestStatus = async (questId: string) => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(questId))

  if (error) {
    console.error(error)
    return { status: null }
  }

  if (!data) {
    console.warn("No data found for quest ID: ", questId)
    return { status: null }
  }

  return { status: data.status }
}

export const updateQuestStatus = async (questId: string, updatedAt: string) => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(questId))
  if (error) {
    console.error(error)
    return { error }
  }
  
  if (!data) {
    console.warn("No data found for quest ID: ", questId)
    return { error: null }
  }
  
  const { error: updateError } = await tryCatch(NEW_ENTRY_KV.set(questId, updatedAt, "Published", "sideQuest"))
  if (updateError) {
    console.error(updateError)
    return { error: updateError }
  }

  return { error: null }
}

const getQuestIds = cache(unstable_cache(async () => {
  const questsPromise = getManagementEntries("sideQuests")
  const newEntriesPromise = tryCatch(NEW_ENTRY_KV.getAll())
  const [quests, newEntries] = await Promise.all([questsPromise, newEntriesPromise])
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  if (quests.error || !quests.data) {
    console.error(`Error getting management side quests`, quests.error)
  }
  
  if (newEntries.error || !newEntries.data) {
    console.error(`Error getting new side quests`, newEntries.error)
  }

  quests.data?.items.forEach(quest => {
    if (!quest.sys.publishedVersion) {
      draftIds.add(quest.sys.id)
    } else if (!!quest.sys.publishedVersion && quest.sys.version >= quest.sys.publishedVersion + 2) {
      changedIds.add(quest.sys.id)
    }
  })

  newEntries.data?.forEach(entry => {
    if (entry.type !== "sideQuest") return
    newIds.add(entry.entryId)
  })

  return { newIds, draftIds, changedIds }
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

const resolveQuestData = cache(async (quest: Entry<TypeSideQuestsSkeleton, undefined, string>, questIds: Awaited<ReturnType<typeof getQuestIds>>) => {
  const { changedIds, draftIds, newIds } = questIds
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

const INTERNAL_getSideQuestData = cache(async (draftMode: boolean) => {
  const { data: quests, error} = await getEntries<TypeSideQuestsSkeleton>({
    content_type: 'sideQuests',
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields"
    ],
    order: ["-sys.createdAt"]
  }, draftMode)

  if (error) {
    console.error(error)
    return []
  }

  const sortedQuests = quests.items.sort((a, b) => {
    const aMap = resolveEntry(a.fields.map)?.fields.releaseDate
    const bMap = resolveEntry(b.fields.map)?.fields.releaseDate
    const aDate = new Date(aMap!).getTime()
    const bDate = new Date(bMap!).getTime()
    return aDate < bDate ? 1 : aDate === bDate ? 0 : -1
  })

  return sortedQuests
})