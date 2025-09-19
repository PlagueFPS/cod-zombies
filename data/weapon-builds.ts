import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"

export type MinifiedWeaponBuild = NonNullable<Awaited<ReturnType<typeof getWeaponBuildById>>>

export const getWeaponBuildById = cache(async (id: string) => {
	"use cache"
	cacheTag(CACHE_KEYS.weaponBuilds.all, CACHE_KEYS.weaponBuilds.byId(id))

	return await getWeaponBuildByIdEffect(id).pipe(
		Effect.withLogSpan("get_weapon_build_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

const getWeaponBuildByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const weaponBuild = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "weaponBuilds",
					id,
					draft: IN_DEVELOPMENT,
					select: {
						title: true,
						weapon: true,
						attachments: true,
						buildCode: true,
					},
					populate: {
						weapons: {
							title: true,
							image: true,
						},
						weaponAttachments: {
							title: true,
							type: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get weapon build by id: ${id}`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(weaponBuild =>
				Effect.gen(function* () {
					const weapon = yield* assertRelation(weaponBuild.weapon)
					const attachments = weaponBuild.attachments
						? yield* Effect.forEach(weaponBuild.attachments, attachment =>
								Effect.gen(function* () {
									const weaponAttachment = yield* assertRelation(attachment)
									return {
										id: weaponAttachment.id,
										title: weaponAttachment.title,
										type: weaponAttachment.type,
									}
								}),
							)
						: []
					const image = yield* assertRelation(weapon.image)
					return {
						id: weaponBuild.id,
						title: weapon.title,
						attachments,
						buildCode: weaponBuild.buildCode,
						image: createMediaDto(image),
					}
				}),
			),
		)

		return weaponBuild
	}).pipe(Effect.withLogSpan("get_weapon_build_by_id"), Effect.annotateLogs({ id }))

interface Attachment {
	id: string
	title: string
	type: "Optic" | "Muzzle" | "Barrel" | "Underbarrel" | "Magazine" | "Grip" | "Comb" | "Stock" | "Laser" | "Fire Mod"
}

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

const { keplerMicroflex, monolithicSuppressor, chfBarrel, rangerForegrip, extendedMagII, balancedStock, strelokLaser, recoilSprings, reinforcedBarrel, ergonomicRiser, balancedPad, fastMotionLaser, rapidFire, fullChoke, cqbGrip, lightStock, steadyAimLaser, twelveGaugeDragonsBreath, extendedMagIII, akimbo } = attachmentsRegistry

export interface WeaponBuild {
	id: string
	title: string
	image: string
	attachments?: Attachment[]
	buildCode?: string
}

const weaponBuildRegistry = {
	maelstromReckoning: {
		id: "maelstrom-reckoning",
		title: "Maelstrom",
		image: "/weapons/maelstrom.webp",
		attachments: [fullChoke, rangerForegrip, extendedMagII, cqbGrip, lightStock, steadyAimLaser, twelveGaugeDragonsBreath]
	},
	abrA1Reckoning: {
		id: "abr-a1-reckoning",
		title: "ABR A1",
		image: "/weapons/abr-a1.webp",
		attachments: [monolithicSuppressor, reinforcedBarrel, rangerForegrip, extendedMagII, ergonomicRiser, balancedPad, fastMotionLaser, rapidFire]
	},
	gpr91Reckoning: {
		id: "gpr-91-reckoning",
		title: "GPR 91",
		image: "/weapons/gpr-91.webp",
		attachments: [keplerMicroflex, monolithicSuppressor, chfBarrel, rangerForegrip, extendedMagII, balancedStock, strelokLaser, recoilSprings]
	},
	grekhovaAkimbo: {
		id: "grekhova-akimbo",
		title: "Grehkova",
		image: "/weapons/grehkova.webp",
		attachments: [monolithicSuppressor, extendedMagIII, akimbo, steadyAimLaser, rapidFire]
	},
} satisfies Record<string, WeaponBuild>

export type WeaponBuildKey = keyof typeof weaponBuildRegistry
export const {
	maelstromReckoning,
	abrA1Reckoning,
	gpr91Reckoning,
	grekhovaAkimbo,
} = weaponBuildRegistry
