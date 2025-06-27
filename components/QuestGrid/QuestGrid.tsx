import { getMaps } from "@/data/maps"
import { getQuests } from "@/data/side-quests"
import { draftMode } from "next/headers"
import { Suspense } from "react"
import QuestGridClient from "./QuestGrid.client"
import GridLoader from "@/components/Loaders/GridLoader"

export async function MainQuestGrid() {
  const { isEnabled } = await draftMode()
  const maps = await getMaps(isEnabled)

  return (
    <Suspense fallback={<GridLoader />}>
      <QuestGridClient quests={ maps } draftMode={ isEnabled } />
    </Suspense>
  )
}

export async function SideQuestGrid() {
  const { isEnabled } = await draftMode()
  const quests = await getQuests(isEnabled)

  return (
    <Suspense fallback={<GridLoader />}>
      <QuestGridClient quests={ quests } draftMode={ isEnabled } />
    </Suspense>
  )
}
