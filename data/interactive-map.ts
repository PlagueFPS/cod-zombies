import "server-only"
import { type MapId, mapRegistry } from "@/mapConfigs"
import { cache } from "react"

export const getMapConfig = cache(async (mapId: MapId) => {
  const config = mapRegistry[mapId]
  if (!config) {
    throw new Error(`Map config for ${mapId} not found`)
  }

  return await config()
})

export const getAvailableMaps = () => {
  return Object.keys(mapRegistry) as MapId[]
}