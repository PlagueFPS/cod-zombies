"use client"
import type { MapConfig } from "@/types/InteractiveMap"
import dynamic from "next/dynamic"

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap/InteractiveMap'), {
  ssr: false,
  loading: () => <div>Loading Map....</div>
})

export default function InteractiveMapWrapper({ mapConfig }: { mapConfig: MapConfig }) {
  return <InteractiveMap mapConfig={ mapConfig } />
}
