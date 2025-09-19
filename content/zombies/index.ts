import { head, type WeakPoint } from "@/data/weak-points"
import { meleeSwing, type ZombieAttack } from "@/data/zombie-attacks"

export interface Zombie {
	id: string
	title: string
	description: string
	state: "Coming Soon" | "New" | null
	releaseDate: Date
	image: string
	games: string[]
	maps: string[]
	type: "Normal" | "Special" | "Elite" | "Boss"
	speed: "Slow" | "Medium" | "Fast"
	weakPoints: WeakPoint[]
	elementalWeakness: string[]
	attacks: ZombieAttack[]
	spawnBehavior: string
	combatStrategy: () => Promise<typeof import("*.mdx")>
}

export type ZombieKey = keyof typeof zombiesRegistry

const zombiesRegistry = {
	zombie: {
		id: "zombie",
		title: "Zombie",
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
		elementalWeakness: [],
		weakPoints: [head],
		attacks: [meleeSwing],
		combatStrategy: () => import("@/content/zombies/base-zombie.mdx"),
	},
} satisfies Record<string, Zombie>

export const { zombie } = zombiesRegistry
