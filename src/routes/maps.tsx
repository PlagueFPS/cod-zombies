import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/maps")({
	component: MapsLayout,
})

function MapsLayout() {
	return <Outlet />
}
