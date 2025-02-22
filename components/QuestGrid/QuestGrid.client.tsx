"use client"
import { SideQuest } from "@/types/SideQuest"
import { MAP_LIMIT } from "@/utils/constants"
import { calculateSkip } from "@/utils/contentful-utils"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import QuestCard from "./QuestCard/QuestCard"
import QuestPaginationLoader from "../Loaders/QuestPaginationLoader"
import QuestPagination from "./QuestPagination/QuestPagination"

interface IQuestGridClient {
  quests: Omit<SideQuest, "content" | "updatedAt">[]
  draftMode: boolean
}

export default function QuestGridClient({ quests, draftMode }: IQuestGridClient) {
  const searchParams = useSearchParams()
  const game = searchParams.getAll("game")
  const map = searchParams.getAll("map")
  const pageParam = searchParams.get("page")
  const page = pageParam ? parseInt(pageParam) : 1
  const skip = calculateSkip(page, MAP_LIMIT);
  const [filteredQuests, setFilteredQuests] = useState(quests)
  const paginatedQuests = filteredQuests.slice(skip, (MAP_LIMIT * page))

 useEffect(() => {
  let filtered = quests

  if (game.length > 0) {
    filtered = filtered.filter(quest => game.includes(quest.game.slug))
  }

  if (map.length > 0) {
    filtered = filtered.filter(quest => map.includes(quest.map.slug))
  }

  setFilteredQuests(filtered)
 }, [searchParams])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
        { paginatedQuests.length > 0 ?  paginatedQuests.map((quest, index) => (
            <QuestCard 
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
