import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/side-quests")({
	component: SideQuestsLayout,
})

function SideQuestsLayout() {
	return <Outlet />
}
