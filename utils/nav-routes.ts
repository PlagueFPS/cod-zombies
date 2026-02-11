import type { Route } from "next"

export interface NavRoute {
	id: string
	title: string
	href: Route
}

export const NAV_ROUTES: NavRoute[] = [
	{
		id: "main-quests",
		title: "Main Quests",
		href: "/main-quests",
	},
	{
		id: "side-quests",
		title: "Side Quests",
		href: "/side-quests",
	},
	{
		id: "relics",
		title: "Relics",
		href: "/relics",
	},
	{
		id: "bestiary",
		title: "Bestiary",
		href: "/bestiary",
	},
	{
		id: "maps",
		title: "Maps",
		href: "/maps",
	},
]
