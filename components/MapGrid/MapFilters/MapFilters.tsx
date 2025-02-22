import { draftMode } from "next/headers";
import { getGames } from "@/data/games";
import { Suspense } from "react";
import { getMaps } from "@/data/maps";
import MapFilterClient from "./MapFilter.client";
import MapFiltersLoader from "@/components/Loaders/MapFiltersLoader";

const difficulties = [
  {
    id: "easy",
    slug: "easy",
    title: "Easy",
  },
  {
    id: "medium",
    slug: "medium",
    title: "Medium",
  },
  {
    id: "hard",
    slug: "hard",
    title: "Hard",
  }
]

export default async function MapFilters() {
  const { isEnabled } = await draftMode()
  const gamesPromise = getGames(isEnabled)
  const mapsPromise = getMaps(isEnabled)
  const [games, maps] = await Promise.all([gamesPromise, mapsPromise])
  const mapGames = new Set(maps.map(m => m.game.slug))
  const gameFilters = games.filter(g => mapGames.has(g.slug))

  return (
    <Suspense fallback={<MapFiltersLoader />}>
      <MapFilterClient 
        games={ gameFilters }
        difficulties={ difficulties }
      />
    </Suspense>
  )
}