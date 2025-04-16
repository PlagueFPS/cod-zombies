"use client"
import type { FilteredQuests } from "@/types/FilteredQuests"
import type { SideQuest } from "@/types/SideQuest"
import type { FeaturedMapWithoutBody } from "@/types/FeaturedMap"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import { Suspense, useEffect, useState } from "react"
import GridPaginationLoader from "@/components/Loaders/GridPaginationLoader"
import GridPagination from "@/components/GridPagination/GridPagination"
import QuestPreviewCard from "@/components/QuestPreviewCard/QuestPreviewCard"
import { TypeGuards } from "@/utils/functions"
import { useSiteSearchParams } from "@/hooks/useSiteSearchParams"

interface IQuestGridClient {
  quests: Omit<FeaturedMapWithoutBody, "updatedAt">[] | Omit<SideQuest, "content" | "updatedAt">[]
  draftMode: boolean
}

export default function QuestGridClient({ quests, draftMode }: IQuestGridClient) {
  const { searchParams, gameParams, mapParams, difficultyParams, page, validatePageParam } = useSiteSearchParams()
  const [filteredQuests, setFilteredQuests] = useState<FilteredQuests>(quests)
  const skip = calculateSkip(page, MAP_LIMIT);
  const paginatedQuests = filteredQuests.slice(skip, (MAP_LIMIT * page))

 useEffect(() => {
  let filtered: FilteredQuests = quests

  if (gameParams.length > 0) {
    filtered = filtered.filter(quest => gameParams.includes(quest.game.slug))
  }

  if (difficultyParams.length > 0) {
    filtered = filtered.filter(quest => TypeGuards.hasProperty(quest, "difficulty") && difficultyParams.includes(quest.difficulty.toLowerCase()))
  }

  if (mapParams.length > 0) {
    filtered = filtered.filter(quest => TypeGuards.hasProperty(quest, "map") && mapParams.includes(quest.map.slug))
  }

  setFilteredQuests(filtered)
 }, [searchParams])

 useEffect(() => {
  validatePageParam(filteredQuests.length)
 }, [filteredQuests, validatePageParam])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
        { paginatedQuests.length > 0 ?  paginatedQuests.map((quest, index) => (
            <QuestPreviewCard 
              key={ quest.id }
              quest={ quest } 
              questIndex={ index } 
              draftMode={ draftMode } 
            />
          )) : (
            <p className="col-span-4 text-center text-muted-foreground">No quests found with the selected filters.</p>
          )}
      </div>
      <Suspense fallback={<GridPaginationLoader />}>
        <GridPagination data={ filteredQuests } />
      </Suspense>
    </>
  )
}
