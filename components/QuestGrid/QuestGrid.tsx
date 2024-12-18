import { getPaginatedSideQuests } from "@/data/sideQuests"
import { draftMode } from "next/headers"
import QuestCard from "./QuestCard/QuestCard"


export default async function QuestGrid() {
  const { isEnabled } = await draftMode()
  const { sideQuests } = await getPaginatedSideQuests(isEnabled, 1)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { sideQuests.map(quest => (
        <QuestCard key={ quest.id } quest={ quest } isEnabled={ isEnabled } />
      ))}
    </div>
  )
}
