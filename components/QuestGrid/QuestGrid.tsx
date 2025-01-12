import { getPaginatedSideQuests } from "@/data/sideQuests"
import { draftMode } from "next/headers"
import QuestCard from "./QuestCard/QuestCard"
import { SearchParams, validateSearchParams } from "@/utils/validationSchemas"

interface IQuestGrid {
  searchParams: Promise<SearchParams>
  category?: string
}

export default async function QuestGrid({ searchParams, category }: IQuestGrid) {
  const draftModePromise = draftMode()
  const searchParamsPromise = validateSearchParams(searchParams)
  const [{ isEnabled }, { page }] = await Promise.all([draftModePromise, searchParamsPromise])
  const { sideQuests } = await getPaginatedSideQuests(isEnabled, page, category)

  return (
    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { sideQuests.length > 0 ? sideQuests.map(quest => (
        <QuestCard key={ quest.id } quest={ quest } isEnabled={ isEnabled } />
      )) : (
        <div className="inset-0">No Side Quests Found.</div>
      )}
    </div>
  )
}
