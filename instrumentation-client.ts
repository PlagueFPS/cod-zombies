import { initBotId } from "botid/client/core"

initBotId({
	protect: [
		{
			path: "/",
			method: "POST",
		},
		{
			path: "/*",
			method: "POST",
		},
		{
			path: "/side-quests",
			method: "POST",
		},
		{
			path: "/side-quests/*",
			method: "POST",
		},
		{
			path: "/bestiary",
			method: "POST",
		},
		{
			path: "/bestiary/*",
			method: "POST",
		},
		{
			path: "/maps",
			method: "POST",
		},
		{
			path: "/relics",
			method: "POST"
		},
		{
			path: "/relics/*",
			method: "POST"
		}
	],
})
