export interface Zombie {
	id: string
	title: string
	slug: string
	description: string
	state: "Coming Soon" | "New" | null
	releaseDate: Date
	image: string
	games: string[]
	maps: string[]
	type: "Normal" | "Special" | "Elite" | "Boss"
	speed: "Slow" | "Medium" | "Fast"
	weakPoints: string[]
	elementalWeakness: string[]
	attacks: string[]
	spawnBehavior: string
	combatStrategy: () => Promise<typeof import("*.mdx")>
}

export const zombiesRegistry: Record<string, Zombie> = {
	zombie: {
		id: crypto.randomUUID(),
		title: "Zombie",
		slug: "zombie",
		state: null,
		description:
			"The first and most common enemy type. Varying in speeds, zombies provide the most basic threat on their own but will quickly become a challenge in hordes.",
		releaseDate: new Date("November 11, 2008 12:00 AM"),
		image: "/zombies/base-zombie.avif",
		type: "Normal",
		speed: "Medium",
		spawnBehavior:
			"Zombies spawn at the start of and throughout each round. Special situations like boss fights or main quest interactions may alter the spawns of zombies, changing them or completely removing them temporarily.",
		games: [],
		maps: [],
		weakPoints: [],
		elementalWeakness: [],
		attacks: [],
		combatStrategy: () => import("@/content/zombies/base-zombie.mdx"),
	},
}
