import "server-only"
import { type MapId, mapRegistry } from "@/map-configs"
import { cache } from "react"
import { tryCatch } from "@/utils/functions"

export const getMapConfig = cache(async (mapId: MapId) => {
  const config = mapRegistry[mapId]
  return await tryCatch(config())
})

export const getAvailableMaps = () => {
  return Object.keys(mapRegistry) as MapId[]
}