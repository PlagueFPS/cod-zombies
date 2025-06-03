"use client"
import type { MapConfig } from "@/types/InteractiveMap"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap/InteractiveMap'), {
  ssr: false,
  loading: () => <div>Loading Map....</div>
})

export default function InteractiveMapWrapper({ mapConfig }: { mapConfig: MapConfig }) {
  return (
    <Suspense fallback={<div>Loading Map...</div>}>
      <InteractiveMap mapConfig={ mapConfig } />
    </Suspense>
  )
}
