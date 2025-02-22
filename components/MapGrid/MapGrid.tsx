import { draftMode } from "next/headers"
import { getMaps } from "@/data/maps"
import { Suspense } from "react"
import MapPagination from "./MapPagination/MapPagination"
import MapPaginationLoader from "../Loaders/MapPaginationLoader"
import MapGridClient from "./MapGrid.client"
import MapGridLoader from "../Loaders/MapGridLoader"


export default async function MapGrid() {
  const { isEnabled } = await draftMode()
  const maps = await getMaps(isEnabled)
  const clientMaps = maps.map(m => {
    const { updatedAt, ...rest } = m
    return rest
  })

  return (
    <>
      <Suspense fallback={<MapGridLoader />}>
        <MapGridClient maps={ clientMaps } draftMode={ isEnabled } />
      </Suspense>
      <Suspense fallback={<MapPaginationLoader />}>
        <MapPagination maps={ clientMaps } />
      </Suspense>
    </>
  )
}
