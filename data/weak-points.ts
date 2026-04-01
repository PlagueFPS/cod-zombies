import { HashMap } from "effect"

export interface WeakPoint {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "WeakPoint"
	/** Unique identifier for the weak point */
	readonly id: string
	/** Name of the weak point */
	readonly title: string
}

/** Union type of all weak points */
export type WeakPointKey = HashMap.HashMap.Key<typeof weakPointsHashMap>

/**
 * Gets a weak point by its key.
 * @param key The key of the weak point.
 */
export const getWeakPointByKey = (key: WeakPointKey) => HashMap.get(weakPointsHashMap, key)

const makeWeakPoint = <T extends string>(
	identifier: T,
	weakPoint: Omit<WeakPoint, "_tag" | "id">,
): [T, WeakPoint] => [
	identifier,
	{
		_tag: "WeakPoint",
		id: identifier,
		...weakPoint,
	},
]

const weakPointsHashMap = HashMap.make(
	makeWeakPoint("head", {
		title: "Head",
	}),
	makeWeakPoint("power-core", {
		title: "Power Core",
	}),
	makeWeakPoint("glowing-mouths", {
		title: "Glowing Mouths",
	}),
	makeWeakPoint("glowing-symbol", {
		title: "Glowing Symbol",
	}),
	makeWeakPoint("spores", {
		title: "Spores",
	}),
	makeWeakPoint("red-camera", {
		title: "Red Camera",
	}),
	makeWeakPoint("arm-cannon", {
		title: "Arm Cannon",
	}),
	makeWeakPoint("red-glowing-spots", {
		title: "Red Glowing Spots",
	}),
	makeWeakPoint("blue-glowing-spots", {
		title: "Blue Glowing Spots",
	}),
	makeWeakPoint("power-cores", {
		title: "Power Cores",
	}),
	makeWeakPoint("back-sacs", {
		title: "Back Sacs",
	}),
	makeWeakPoint("elbow-sacs", {
		title: "Elbow Sacs",
	}),
	makeWeakPoint("encrusted-lava", {
		title: "Encrusted Lava",
	}),
	makeWeakPoint("eye-pupil", {
		title: "Eye Pupil",
	}),
	makeWeakPoint("forehead-crystal", {
		title: "Forehead Crystal",
	}),
	makeWeakPoint("chest", {
		title: "Chest",
	}),
	makeWeakPoint("body", {
		title: "Body",
	}),
	makeWeakPoint("mouth", {
		title: "Mouth",
	}),
	makeWeakPoint("shoulders", {
		title: "Shoulders",
	}),
	makeWeakPoint("stomach", {
		title: "Stomach",
	}),
	makeWeakPoint("glowing-heads", {
		title: "Glowing Heads",
	}),
	makeWeakPoint("red-cysts", {
		title: "Red Cysts",
	}),
	makeWeakPoint("glowing-tentacles", {
		title: "Glowing Tentacles",
	}),
	makeWeakPoint("eyes", {
		title: "Eyes",
	}),
	makeWeakPoint("forearms", {
		title: "Forearms",
	}),
	makeWeakPoint("calves", {
		title: "Calves",
	}),
	makeWeakPoint("attached-zombies", {
		title: "Attached Zombies",
	}),
	makeWeakPoint("glowing-lights", {
		title: "Glowing Lights",
	}),
	makeWeakPoint("jetpack", {
		title: "Jetpack",
	}),
	makeWeakPoint("bee-nests", {
		title: "Bee Nests",
	}),
	makeWeakPoint("golden-underbelly", {
		title: "Golden Underbelly",
	}),
)
