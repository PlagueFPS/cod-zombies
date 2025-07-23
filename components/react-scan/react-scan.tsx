"use client"
import { useEffect } from "react"
import { scan } from "react-scan"
import { IN_DEVELOPMENT } from "@/utils/constants"

export default function ReactScan() {
	useEffect(() => {
		scan({
			enabled: IN_DEVELOPMENT,
			showFPS: true,
			showToolbar: true,
			showNotificationCount: true,
		})
	}, [])
	return null
}
