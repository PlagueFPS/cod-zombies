import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/main-quests")({
	component: MainQuestsLayout,
})

function MainQuestsLayout() {
	return <Outlet />
}
