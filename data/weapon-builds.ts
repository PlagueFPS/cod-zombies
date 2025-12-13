import type { WeaponsImagePath } from "@/types/generated/image-paths.gen"

interface Attachment {
	/** Unique identifier for the attachment */
	id: string
	/** Name of the attachment */
	title: string
	/** Type of the attachment */
	type:
		| "Optic"
		| "Muzzle"
		| "Barrel"
		| "Underbarrel"
		| "Magazine"
		| "Grip"
		| "Comb"
		| "Stock"
		| "Laser"
		| "Fire Mod"
}

export interface WeaponBuild {
	/** Unique identifier for the weapon build */
	id: string
	/** Name of the weapon build */
	title: string
	/** Image of the weapon build */
	image: WeaponsImagePath
	/** Attachments used in the weapon build */
	attachments?: Attachment[]
	/** Build code for the weapon build */
	buildCode?: string
}

/** Union type of all weapon builds */
export type WeaponBuildKey = keyof typeof weaponBuildRegistry

/**
 * Gets a weapon build by its key.
 * @param key The key of the weapon build.
 * @returns The weapon build.
 */
export const getWeaponBuildByKey = (key: WeaponBuildKey): WeaponBuild => weaponBuildRegistry[key]

const attachmentsRegistry = {
	keplerMicroflex: {
		id: "kepler-microflex",
		title: "Kepler Microflex",
		type: "Optic",
	},
	monolithicSuppressor: {
		id: "monolithic-suppressor",
		title: "Monolithic Suppressor",
		type: "Muzzle",
	},
	chfBarrel: {
		id: "chf-barrel",
		title: "CHF Barrel",
		type: "Barrel",
	},
	rangerForegrip: {
		id: "ranger-foregrip",
		title: "Ranger Foregrip",
		type: "Grip",
	},
	extendedMagII: {
		id: "extended-mag-2",
		title: "Extended Mag II",
		type: "Magazine",
	},
	balancedStock: {
		id: "balanced-stock",
		title: "Balanced Stock",
		type: "Stock",
	},
	strelokLaser: {
		id: "strelok-laser",
		title: "Strelok Laser",
		type: "Laser",
	},
	recoilSprings: {
		id: "recoil-springs",
		title: "Recoil Springs",
		type: "Fire Mod",
	},
	reinforcedBarrel: {
		id: "reinforced-barrel",
		title: "Reinforced Barrel",
		type: "Barrel",
	},
	ergonomicRiser: {
		id: "ergonomic-riser",
		title: "Ergonomic Riser",
		type: "Comb",
	},
	balancedPad: {
		id: "balanced-pad",
		title: "Balanced Pad",
		type: "Stock",
	},
	fastMotionLaser: {
		id: "fast-motion-laser",
		title: "Fast Motion Laser",
		type: "Laser",
	},
	rapidFire: {
		id: "rapid-fire",
		title: "Rapid Fire",
		type: "Fire Mod",
	},
	fullChoke: {
		id: "full-choke",
		title: "Full Choke",
		type: "Muzzle",
	},
	cqbGrip: {
		id: "cqb-grip",
		title: "CQB Grip",
		type: "Grip",
	},
	lightStock: {
		id: "light-stock",
		title: "Light Stock",
		type: "Stock",
	},
	steadyAimLaser: {
		id: "steady-aim-laser",
		title: "Steady Aim Laser",
		type: "Laser",
	},
	twelveGaugeDragonsBreath: {
		id: "12-gauge-dragons-breath",
		title: "12-Gauge Dragon's Breath",
		type: "Fire Mod",
	},
	extendedMagIII: {
		id: "extended-mag-3",
		title: "Extended Mag III",
		type: "Magazine",
	},
	akimbo: {
		id: "akimbo",
		title: "Akimbo",
		type: "Stock",
	},
} as const satisfies Record<string, Attachment>

const weaponBuildRegistry = {
	maelstromReckoning: {
		id: "maelstrom-reckoning",
		title: "Maelstrom",
		image: "/weapons/maelstrom.webp",
		attachments: [
			attachmentsRegistry.fullChoke,
			attachmentsRegistry.rangerForegrip,
			attachmentsRegistry.extendedMagII,
			attachmentsRegistry.cqbGrip,
			attachmentsRegistry.lightStock,
			attachmentsRegistry.steadyAimLaser,
			attachmentsRegistry.twelveGaugeDragonsBreath,
		],
	},
	abrA1Reckoning: {
		id: "abr-a1-reckoning",
		title: "ABR A1",
		image: "/weapons/abr-a1.webp",
		attachments: [
			attachmentsRegistry.monolithicSuppressor,
			attachmentsRegistry.reinforcedBarrel,
			attachmentsRegistry.rangerForegrip,
			attachmentsRegistry.extendedMagII,
			attachmentsRegistry.ergonomicRiser,
			attachmentsRegistry.balancedPad,
			attachmentsRegistry.fastMotionLaser,
			attachmentsRegistry.rapidFire,
		],
	},
	gpr91Reckoning: {
		id: "gpr-91-reckoning",
		title: "GPR 91",
		image: "/weapons/gpr-91.webp",
		attachments: [
			attachmentsRegistry.keplerMicroflex,
			attachmentsRegistry.monolithicSuppressor,
			attachmentsRegistry.chfBarrel,
			attachmentsRegistry.rangerForegrip,
			attachmentsRegistry.extendedMagII,
			attachmentsRegistry.balancedStock,
			attachmentsRegistry.strelokLaser,
			attachmentsRegistry.recoilSprings,
		],
	},
	grekhovaAkimbo: {
		id: "grekhova-akimbo",
		title: "Grehkova",
		image: "/weapons/grekhova.webp",
		attachments: [
			attachmentsRegistry.monolithicSuppressor,
			attachmentsRegistry.extendedMagIII,
			attachmentsRegistry.akimbo,
			attachmentsRegistry.steadyAimLaser,
			attachmentsRegistry.rapidFire,
		],
	},
	ds20Mirage: {
		id: "ds20-mirage",
		title: "DS20 Mirage",
		image: "/weapons/ds20-mirage.webp",
		buildCode: "A05-AV3ET-NQL93-1",
	},
	akita: {
		id: "akita",
		title: "Akita",
		image: "/weapons/akita.webp",
		buildCode: "C03-6AL6S-VU531",
	},
	m34Novaline: {
		id: "m34-novaline",
		title: "M34 Novaline",
		image: "/weapons/m34-novaline.webp",
		buildCode: "M03-5XK7Z-12JQ3-1",
	},
	ak27: {
		id: "ak27",
		title: "AK-27",
		image: "/weapons/ak-27.webp",
		buildCode: "A02-B1CH3-JXTF3-1",
	},
	jager45: {
		id: "jager45",
		title: "Jäger 45",
		image: "/weapons/jager-45.webp",
		buildCode: "P01-AAEER-QI6WQ-11",
	},
	m10Breacher: {
		id: "m10-breacher",
		title: "M10 Breacher",
		image: "/weapons/m10-breacher.webp",
		buildCode: "C01-N6NC4-8BLR1-1",
	},
	coda9: {
		id: "coda-9",
		title: "CODA 9",
		image: "/weapons/coda-9.webp",
		buildCode: "P03-68Y2H-HNL31",
	},
	kogot7: {
		id: "kogot-7",
		title: "Kogot-7",
		image: "/weapons/kogot-7.webp",
		buildCode: "S10-JUJZG-U6S28-31",
	},
} as const satisfies Record<string, WeaponBuild>
