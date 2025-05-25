"use client"
import dynamic from "next/dynamic"

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap/InteractiveMap'), {
  ssr: false,
  loading: () => <div>Loading Map....</div>
})

export default function InteractiveMapWrapper() {
  return <InteractiveMap />
}
