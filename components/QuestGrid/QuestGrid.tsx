import { getMaps } from "@/data/maps"
import { getQuests } from "@/data/sideQuests"
import { draftMode } from "next/headers"
import { Suspense } from "react"
import QuestGridClient from "./QuestGrid.client"
import GridLoader from "@/components/Loaders/GridLoader"

export async function MainQuestGrid() {
  const { isEnabled } = await draftMode()
  const maps = await getMaps(isEnabled)
  const clientMaps = maps.map(m => {
    const { updatedAt, ...rest } = m
    return rest
  })

  return (
    <Suspense fallback={<GridLoader />}>
      <QuestGridClient quests={ clientMaps } draftMode={ isEnabled } />
    </Suspense>
  )
}

export async function SideQuestGrid() {
  const { isEnabled } = await draftMode()
  const quests = await getQuests(isEnabled)
  const clientQuests = quests.map(q => {
    const { updatedAt, ...rest } = q
    return rest
  })

  return (
    <Suspense fallback={<GridLoader />}>
      <QuestGridClient quests={ clientQuests } draftMode={ isEnabled } />
    </Suspense>
  )
}
