import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/newsletter/unsubscribe")({
	component: UnsubscribeLayout,
})

function UnsubscribeLayout() {
	return <Outlet />
}
