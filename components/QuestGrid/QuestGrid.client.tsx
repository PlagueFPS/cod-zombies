"use client"
import type { FilteredQuests } from "@/types/FilteredQuests"
import type { SideQuest } from "@/types/SideQuest"
import type { FeaturedMapWithoutBody } from "@/types/FeaturedMap"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import QuestPaginationLoader from "@/components/Loaders/QuestPaginationLoader"
import QuestPagination from "@/components/QuestPagination/QuestPagination"
import QuestPreviewCard from "@/components/QuestPreviewCard/QuestPreviewCard"
import { TypeGuards } from "@/utils/functions"

interface IQuestGridClient {
  quests: Omit<FeaturedMapWithoutBody, "updatedAt">[] | Omit<SideQuest, "content" | "updatedAt">[]
  draftMode: boolean
}

export default function QuestGridClient({ quests, draftMode }: IQuestGridClient) {
  const searchParams = useSearchParams()
  const [filteredQuests, setFilteredQuests] = useState<FilteredQuests>(quests)
  const game = searchParams.getAll("game")
  const map = searchParams.getAll("map")
  const difficulty = searchParams.getAll("difficulty")
  const pageParam = searchParams.get("page")
  const page = pageParam ? parseInt(pageParam) : 1
  const skip = calculateSkip(page, MAP_LIMIT);
  const paginatedQuests = filteredQuests.slice(skip, (MAP_LIMIT * page))

 useEffect(() => {
  let filtered: FilteredQuests = quests

  if (game.length > 0) {
    filtered = filtered.filter(quest => game.includes(quest.game.slug))
  }

  if (difficulty.length > 0) {
    filtered = filtered.filter(quest => TypeGuards.hasProperty(quest, "difficulty") && difficulty.includes(quest.difficulty.toLowerCase()))
  }

  if (map.length > 0) {
    filtered = filtered.filter(quest => TypeGuards.hasProperty(quest, "map") && map.includes(quest.map.slug))
  }

  setFilteredQuests(filtered)
 }, [searchParams])

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
      <Suspense fallback={<QuestPaginationLoader />}>
        <QuestPagination quests={ filteredQuests } />
      </Suspense>
    </>
  )
}
