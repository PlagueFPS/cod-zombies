import { getZombies } from "@/data/zombies"
import { draftMode } from "next/headers"
import { Suspense } from "react"
import BestiaryGridClient from "./bestiary-grid.client"
import GridLoader from "../loaders/grid-loader"

export default async function BestiaryGrid() {
  const { isEnabled } = await draftMode()
  const zombies = await getZombies(isEnabled)

  return (
    <Suspense fallback={<GridLoader />}>
      <BestiaryGridClient zombies={ zombies } draftMode={ isEnabled } />
    </Suspense>
  )
}
