import { useEffect } from "react"
import { scan } from "react-scan"

/** Loaded only in development via `import.meta.env.DEV` dynamic import from `__root`. */
export default function ReactScan() {
	useEffect(() => {
		scan({
			enabled: true,
			showFPS: true,
			showToolbar: true,
			showNotificationCount: true,
		})
	}, [])
	return null
}
