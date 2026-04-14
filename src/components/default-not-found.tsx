import { useLocation } from "@tanstack/react-router"
import NotFoundContent from "@/components/not-found-content"

export function DefaultNotFound() {
	const location = useLocation()
	return <NotFoundContent resource="Page" pathname={location.pathname} />
}
