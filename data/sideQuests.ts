import 'server-only'
import { getEntries } from '@/contentful/contentful'
import { TypeSideQuestsSkeleton } from '@/contentful/Types/contentful-types'
import { CACHE_KEYS, MAP_LIMIT, MAX_NEW_TIME } from '@/utils/constants'
import { 
  calculateSkip, 
  createImageDTO, 
  createMapCategoryDTO, 
  createQuestMapDTO, 
  resolveAsset, 
  resolveEntry 
} from '@/utils/contentful-utils'
import { cache } from 'react'
import { revalidateTag, unstable_cache } from 'next/cache'
import { Entry } from 'contentful'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { db } from '@/db/db'
import { quests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { submitFeedbackUseCase } from '@/usecases/feedback'

export const getQuests = cache(unstable_cache(async (draftMode: boolean) => {
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getDraftsAndChanged()
  const [quests, questIds] = await Promise.all([questsPromise, questIdsPromise])
  return await Promise.all(quests.map(async q => {
    const { category: game, ...rest } = await resolveQuestData(q, questIds)
    return {
      ...rest,
      id: q.sys.id,
      updatedAt: q.sys.updatedAt,
      title: q.fields.title,
      slug: q.fields.slug,
      description: q.fields.description,
      timeToRead: q.fields.timeToRead,
      game,
    }
  }))
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getDraftsAndChanged()
  const [quests, questIds] = await Promise.all([questsPromise, questIdsPromise])
  return await Promise.all(quests.map(async q => {
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

export const getPaginatedSideQuests = cache(unstable_cache(async (draftMode: boolean, page: number, category?: string) => {
  const skip = calculateSkip(page, MAP_LIMIT)
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getDraftsAndChanged()
  const [sideQuestsData, questIds] = await Promise.all([questsPromise, questIdsPromise])
  let sideQuests = sideQuestsData

  if (category) {
    sideQuests = sideQuestsData.filter(q => 
      resolveEntry(q.fields.game)?.fields.slug === category ||
      resolveEntry(q.fields.map)?.fields.slug === category
    )
  }
  
  const paginatedQuests = sideQuests.slice(skip, (MAP_LIMIT * page))
  const sideQuestsDTO = await Promise.all(paginatedQuests.map(async quest => {
    const { category, image, isChanged, isDraft, map } = await resolveQuestData(quest, questIds)
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

export const getQuestById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const quests = await INTERNAL_getSideQuestData(draftMode)
  const quest = quests.find(q => q.sys.id === id)
  if (!quest) return null

  return {
    slug: quest.fields.slug,
    map: createQuestMapDTO(resolveEntry(quest.fields.map)).slug,
    game: createMapCategoryDTO(resolveEntry(quest.fields.game)).slug
  }
}, [], {
  tags: [CACHE_KEYS.SIDE_QUESTS.ALL]
}))

export const getQuestBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  const questsPromise = INTERNAL_getSideQuestData(draftMode)
  const questIdsPromise = getDraftsAndChanged()
  const [quests, questIds] = await Promise.all([questsPromise, questIdsPromise])
  const q = quests.find(q => q.fields.slug === slug)
  if (!q) return null
  const { category: game, ...rest } = await resolveQuestData(q, questIds)
  return {
    ...rest,
    id: q.sys.id,
    updatedAt: q.sys.updatedAt,
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
  try {
    await db.insert(quests).values({ questId: id, publishedAt: createdAt })
    return { error: null }
  } catch (error) {
    console.error(error)
    return { error: `Failed to store quest ID: ${id}`}
  }
}

export const enforceNewQuestStatus = async () => {
  try {
    const newQuests = await db.select({
      questId: quests.questId,
      publishedAt: quests.publishedAt
    }).from(quests)

    for (const quest of newQuests) {
      const currentTime = Date.now()
      const publishedTime = new Date(quest.publishedAt).getTime()

      if (currentTime - publishedTime > MAX_NEW_TIME) {
        console.log(`[QUEST ENFORCEMENT] Deleting Quest ${quest.questId} from DB...`)
        await db.delete(quests).where(eq(quests.questId, quest.questId))
        console.log(`[QUEST ENFORCEMENT] revalidating ${CACHE_KEYS.SIDE_QUESTS.ALL}`)
        revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
      } else continue
    }
  } catch (error) {
    console.error(`[QUEST ENFORCEMENT] Error enforcing quests: ${error}`)
      const { success } = await submitFeedbackUseCase({
        title: "Quest Status Error",
        label: "issue",
        feedback: `Error enforcing quests: ${error}`
      })
      if (!success) console.error(`[QUEST ENFORCEMENT] Failed to submit feedback`)
  }
}

const getDraftsAndChanged = cache(unstable_cache(async () => {
  const quests = await getManagementEntries("sideQuests")
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

const resolveQuestData = cache(async (quest: Entry<TypeSideQuestsSkeleton, undefined, string>, questIds: Awaited<ReturnType<typeof getDraftsAndChanged>>) => {
  const { changedIds, draftIds } = questIds
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

  const sortedQuests = quests.items.sort((a, b) => {
    const aMap = resolveEntry(a.fields.map)?.fields.releaseDate!
    const bMap = resolveEntry(b.fields.map)?.fields.releaseDate!
    const aDate = new Date(aMap).getTime()
    const bDate = new Date(bMap).getTime()
    return aDate < bDate ? 1 : aDate === bDate ? 0 : -1
  })

  return sortedQuests
})