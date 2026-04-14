import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/bestiary")({
	component: BestiaryLayout,
})

function BestiaryLayout() {
	return <Outlet />
}
