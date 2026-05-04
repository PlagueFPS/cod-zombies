import type { WeaponsImagePath } from "@/types/generated/image-paths.gen"
import { HashMap, Option } from "effect"

export interface Attachment {
	/** Unique identifier for the attachment */
	readonly id: string
	/** Name of the attachment */
	readonly title: string
	/** Type of the attachment */
	readonly type:
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
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "WeaponBuild"
	/** Unique identifier for the weapon build */
	readonly id: string
	/** Name of the weapon build */
	readonly title: string
	/** Image of the weapon build */
	readonly image: WeaponsImagePath
	/** Attachments used in the weapon build */
	readonly attachments: Option.Option<[Attachment, ...Attachment[]]>
	/** Build code for the weapon build */
	readonly buildCode: Option.Option<string>
}

/** Union type of all weapon builds */
export type WeaponBuildKey = HashMap.HashMap.Key<typeof weaponBuildHashMap>

/**
 * Gets a weapon build by its key.
 * @param key The key of the weapon build.
 * @returns The weapon build.
 */
export const getWeaponBuildByKey = (key: WeaponBuildKey) => HashMap.get(weaponBuildHashMap, key)

const makeWeaponBuild = <T extends string>(
	id: T,
	weaponBuild: Omit<WeaponBuild, "_tag" | "id">,
): [T, WeaponBuild] => [
	id,
	{
		_tag: "WeaponBuild" as const,
		id,
		...weaponBuild,
	},
]

/**
 * @deprecated New weapon builds should define build codes instead of attachments.
 */
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
} satisfies Record<string, Attachment>

const weaponBuildHashMap = HashMap.make(
	makeWeaponBuild("maelstrom-reckoning", {
		title: "Maelstrom",
		image: "/weapons/maelstrom.webp",
		attachments: Option.some([
			attachmentsRegistry.fullChoke,
			attachmentsRegistry.rangerForegrip,
			attachmentsRegistry.extendedMagII,
			attachmentsRegistry.cqbGrip,
			attachmentsRegistry.lightStock,
			attachmentsRegistry.steadyAimLaser,
			attachmentsRegistry.twelveGaugeDragonsBreath,
		]),
		buildCode: Option.none(),
	}),
	makeWeaponBuild("abr-a1-reckoning", {
		title: "ABR A1",
		image: "/weapons/abr-a1.webp",
		attachments: Option.some([
			attachmentsRegistry.monolithicSuppressor,
			attachmentsRegistry.reinforcedBarrel,
			attachmentsRegistry.rangerForegrip,
			attachmentsRegistry.extendedMagII,
			attachmentsRegistry.ergonomicRiser,
			attachmentsRegistry.balancedPad,
			attachmentsRegistry.fastMotionLaser,
			attachmentsRegistry.rapidFire,
		]),
		buildCode: Option.none(),
	}),
	makeWeaponBuild("gpr-91-reckoning", {
		title: "GPR 91",
		image: "/weapons/gpr-91.webp",
		attachments: Option.some([
			attachmentsRegistry.keplerMicroflex,
			attachmentsRegistry.monolithicSuppressor,
			attachmentsRegistry.chfBarrel,
			attachmentsRegistry.rangerForegrip,
			attachmentsRegistry.extendedMagII,
			attachmentsRegistry.balancedStock,
			attachmentsRegistry.strelokLaser,
			attachmentsRegistry.recoilSprings,
		]),
		buildCode: Option.none(),
	}),
	makeWeaponBuild("grekhova-akimbo", {
		title: "Grehkova",
		image: "/weapons/grekhova.webp",
		attachments: Option.some([
			attachmentsRegistry.monolithicSuppressor,
			attachmentsRegistry.extendedMagIII,
			attachmentsRegistry.akimbo,
			attachmentsRegistry.steadyAimLaser,
			attachmentsRegistry.rapidFire,
		]),
		buildCode: Option.none(),
	}),
	makeWeaponBuild("ds20-mirage", {
		title: "DS20 Mirage",
		image: "/weapons/ds20-mirage.webp",
		attachments: Option.none(),
		buildCode: Option.some("A05-AV3ET-NQL93-1"),
	}),
	makeWeaponBuild("akita", {
		title: "Akita",
		image: "/weapons/akita.webp",
		attachments: Option.none(),
		buildCode: Option.some("C03-6AL6S-VU531"),
	}),
	makeWeaponBuild("m34-novaline", {
		title: "M34 Novaline",
		image: "/weapons/m34-novaline.webp",
		attachments: Option.none(),
		buildCode: Option.some("M03-5XK7Z-12JQ3-1"),
	}),
	makeWeaponBuild("ak27", {
		title: "AK-27",
		image: "/weapons/ak-27.webp",
		attachments: Option.none(),
		buildCode: Option.some("A02-B1CH3-JXTF3-1"),
	}),
	makeWeaponBuild("jager45", {
		title: "Jäger 45",
		image: "/weapons/jager-45.webp",
		attachments: Option.none(),
		buildCode: Option.some("P01-AAEER-QI6WQ-11"),
	}),
	makeWeaponBuild("m10-breacher", {
		title: "M10 Breacher",
		image: "/weapons/m10-breacher.webp",
		attachments: Option.none(),
		buildCode: Option.some("C01-NBWA2-JZAT1-1"),
	}),
	makeWeaponBuild("coda-9", {
		title: "CODA 9",
		image: "/weapons/coda-9.webp",
		attachments: Option.none(),
		buildCode: Option.some("P03-68Y2H-HNL31"),
	}),
	makeWeaponBuild("kogot-7", {
		title: "Kogot-7",
		image: "/weapons/kogot-7.webp",
		attachments: Option.none(),
		buildCode: Option.some("S10-JUJZG-U6S28-31"),
	}),
	makeWeaponBuild("mxr-17", {
		title: "MXR-17",
		image: "/weapons/mxr-17.webp",
		attachments: Option.none(),
		buildCode: Option.some("A03-B18BA-KKD63-1"),
	}),
	makeWeaponBuild("1911", {
		title: "1911",
		image: "/weapons/1911.webp",
		attachments: Option.none(),
		buildCode: Option.some("P07-AA94E-1D6UU-11"),
	}),
	makeWeaponBuild("voyak-kt-3", {
		title: "Voyak KT-3",
		image: "/weapons/voyak-kt-3.webp",
		attachments: Option.none(),
		buildCode: Option.some("A09-2JD73-CS1JZ-4N11"),
	}),
	makeWeaponBuild("xr-3-ion", {
		title: "XR-3 Ion",
		image: "/weapons/xr-3-ion.webp",
		attachments: Option.none(),
		buildCode: Option.some("R03-5XMTQ-U1SU5-1"),
	}),
)
