"use client"
import dynamic from "next/dynamic"

// dynamic import to avoid hydration error for client-side only component
const ReactScan = dynamic(() => import("@/components/react-scan/react-scan"), {
	ssr: false,
})

export default function ReactScanWrapper() {
	return <ReactScan />
}
