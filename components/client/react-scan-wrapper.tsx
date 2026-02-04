"use client"
import dynamic from "next/dynamic"

// dynamic import to avoid hydration error for client-side only component
const ReactScan = dynamic(() => import("@/components/client/react-scan"), {
	ssr: false,
})

export default function ReactScanWrapper() {
	return <ReactScan />
}
