export interface WeakPoint {
	/** Unique identifier for the weak point */
	id: string
	/** Name of the weak point */
	title: string
}

const weakPointsRegistry = {
	head: {
		id: "head",
		title: "Head",
	},
	powerCore: {
		id: "power-core",
		title: "Power Core",
	},
	glowingMouths: {
		id: "glowing-mouths",
		title: "Glowing Mouths",
	},
	glowingSymbol: {
		id: "glowing-symbol",
		title: "Glowing Symbol",
	},
	spores: {
		id: "spores",
		title: "Spores",
	},
	redCamera: {
		id: "red-camera",
		title: "Red Camera",
	},
	armCannon: {
		id: "arm-cannon",
		title: "Arm Cannon",
	},
	redGlowingSpots: {
		id: "red-glowing-spots",
		title: "Red Glowing Spots",
	},
	powerCores: {
		id: "power-cores",
		title: "Power Cores",
	},
	backSacs: {
		id: "back-sacs",
		title: "Back Sacs",
	},
	elbowSacs: {
		id: "elbow-sacs",
		title: "Elbow Sacs",
	},
	encrustedLava: {
		id: "encrusted-lava",
		title: "Encrusted Lava",
	},
	eyePupil: {
		id: "eye-pupil",
		title: "Eye Pupil",
	},
	foreheadCrystal: {
		id: "forehead-crystal",
		title: "Forehead Crystal",
	},
	chest: {
		id: "chest",
		title: "Chest",
	},
	body: {
		id: "body",
		title: "Body",
	},
	mouth: {
		id: "mouth",
		title: "Mouth",
	},
	shoulders: {
		id: "shoulders",
		title: "Shoulders",
	},
	stomach: {
		id: "stomach",
		title: "Stomach",
	},
	glowingHeads: {
		id: "glowing-heads",
		title: "Glowing Heads",
	},
	redCysts: {
		id: "red-cysts",
		title: "Red Cysts",
	},
	glowingTentacles: {
		id: "glowing-tentacles",
		title: "Glowing Tentacles",
	},
	eyes: {
		id: "eyes",
		title: "Eyes",
	},
	forearms: {
		id: "forearms",
		title: "Forearms",
	},
	calves: {
		id: "calves",
		title: "Calves",
	},
	attachedZombies: {
		id: "attached-zombies",
		title: "Attached Zombies",
	},
	glowingLights: {
		id: "glowing-lights",
		title: "Glowing Lights",
	},
	jetpack: {
		id: "jetpack",
		title: "Jetpack",
	},
	beeNests: {
		id: "bee-nests",
		title: "Bee Nests",
	},
} as const satisfies Record<string, WeakPoint>

/** Union type of all weak points */
export type WeakPointKey = keyof typeof weakPointsRegistry
export const {
	head,
	powerCore,
	glowingMouths,
	glowingSymbol,
	spores,
	redCamera,
	armCannon,
	redGlowingSpots,
	powerCores,
	backSacs,
	elbowSacs,
	encrustedLava,
	eyePupil,
	foreheadCrystal,
	chest,
	body,
	mouth,
	shoulders,
	stomach,
	glowingHeads,
	redCysts,
	glowingTentacles,
	eyes,
	forearms,
	calves,
	attachedZombies,
	glowingLights,
	jetpack,
	beeNests,
} = weakPointsRegistry
