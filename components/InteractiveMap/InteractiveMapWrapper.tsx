"use client"
import type { MapConfig } from "@/map-configs"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import InteractiveMapLoader from "../Loaders/InteractiveMapLoader"

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap/InteractiveMap'), {
  ssr: false,
  loading: () => <InteractiveMapLoader />
})

export default function InteractiveMapWrapper({ mapConfig }: { mapConfig: MapConfig }) {
  return (
    <Suspense fallback={<InteractiveMapLoader />}>
      <InteractiveMap mapConfig={ mapConfig } />
    </Suspense>
  )
}
