import 'server-only'
import { getEntries } from '@/contentful/contentful'
import { TypeSideQuestsSkeleton } from '@/contentful/Types/contentful-types'
import { MAP_LIMIT } from '@/utils/constants'
import { calculateSkip, createSideQuestsDTO } from '@/utils/contentful-utils'
import { cache } from 'react'

export const getPaginatedSideQuests = cache(async (draftMode: boolean, page: number) => {
  const skip = calculateSkip(page, MAP_LIMIT)
  const sideQuests = await getEntries<TypeSideQuestsSkeleton>({
    content_type: 'sideQuests',
    select: ["sys.id", "sys.updatedAt", "fields"],
    skip,
    limit: MAP_LIMIT,
  }, draftMode)

  const sideQuestsDTO = await createSideQuestsDTO(sideQuests.items)
  const totalPages = Math.ceil(sideQuests.total / MAP_LIMIT)
  const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1

  return {
    sideQuests: sideQuestsDTO.map(quest => {
      const { content, ...rest } = quest
      return rest
    }),
    totalQuests: sideQuests.total,
    totalPages,
    currentPage,
    prevPage,
    nextPage
  }
})