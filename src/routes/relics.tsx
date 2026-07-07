import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/relics")({
	component: RelicsLayout,
})

function RelicsLayout() {
	return <Outlet />
}
