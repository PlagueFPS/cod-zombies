import { getQuests } from "@/data/sideQuests"
import { draftMode } from "next/headers"
import { Suspense } from "react"
import QuestGridClient from "./QuestGrid.client"
import MapGridLoader from "../Loaders/MapGridLoader"

export default async function QuestGrid() {
  const { isEnabled } = await draftMode()
  const quests = await getQuests(isEnabled)
  const clientQuests = quests.map(q => {
    const { updatedAt, ...rest } = q
    return rest
  })

  return (
    <Suspense fallback={<MapGridLoader />}>
      <QuestGridClient quests={ clientQuests } draftMode={ isEnabled } />
    </Suspense>
  )
}
