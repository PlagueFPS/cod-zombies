import { getZombies } from "@/data/zombies"
import { draftMode } from "next/headers"
import { Suspense } from "react"
import BestiaryGridClient from "./BestiaryGrid.client"

export default async function BestiaryGrid() {
  const { isEnabled } = await draftMode()
  const zombies = await getZombies(isEnabled)
  const clientZombies = zombies.map(z => {
    const { updatedAt, ...rest } = z
    return rest
  })

  return (
    <Suspense>
      <BestiaryGridClient zombies={ clientZombies } draftMode={ isEnabled } />
    </Suspense>
  )
}
