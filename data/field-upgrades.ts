import { Effect } from "effect"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cache } from "react"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError } from "@/types/errors"
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants"
import { assertRelation, createMediaDto } from "@/utils/payload-utils"
import {
	type AugmentTuple,
	apexHunter,
	arcaneFury,
	broadBeam,
	burstDash,
	carousel,
	createAugmentDto,
	danceParty,
	darkPact,
	extensionAetherShroud,
	extensionDarkFlare,
	extensionFrenziedGuard,
	extraCharge,
	frenzyFire,
	frequencyBoost,
	groupShroud,
	heavyShadow,
	instantReload,
	lithiumCharged,
	overclocked,
	partyAnimal,
	peeksFavor,
	phalanx,
	powerGrid,
	rally,
	repairBoost,
	retribution,
	scatter,
	shockwave,
	siren,
	socialButterfly,
	staticDischarge,
	supernova,
	transformer,
	turret,
	voidSheath,
} from "./augments"

export type MinifiedFieldUpgrade = NonNullable<Awaited<ReturnType<typeof getFieldUpgradeById>>>

export const getFieldUpgradeById = cache(async (id: string) => {
	"use cache"
	cacheTag(CACHE_KEYS.fieldUpgrades.all, CACHE_KEYS.fieldUpgrades.byId(id))

	return await getFieldUpgradeByIdEffect(id).pipe(
		Effect.withLogSpan("get_field_upgrade_by_id_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

const getFieldUpgradeByIdEffect = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const fieldUpgrade = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "fieldUpgrades",
					id,
					draft: IN_DEVELOPMENT,
					select: {
						title: true,
						image: true,
						description: true,
						augments: true,
					},
					populate: {
						augments: {
							title: true,
							description: true,
							image: true,
							type: true,
						},
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get field upgrade by id: ${id}`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap(fieldUpgrade =>
				Effect.gen(function* () {
					const image = yield* assertRelation(fieldUpgrade.image)
					const augments = fieldUpgrade.augments?.docs
						? yield* Effect.forEach(
								fieldUpgrade.augments.docs,
								augment => createAugmentDto(augment),
								{ concurrency: "unbounded" },
							)
						: []

					return {
						id: fieldUpgrade.id,
						title: fieldUpgrade.title,
						description: fieldUpgrade.description,
						image: createMediaDto(image),
						augments,
					}
				}),
			),
		)

		return fieldUpgrade
	}).pipe(Effect.withLogSpan("get_field_upgrade_by_id"), Effect.annotateLogs({ id }))

export interface FieldUpgrade {
	id: string
	title: string
	description: string
	image: string
	augments?: AugmentTuple
}

const fieldUpgradeRegistry = {
	ringOfFire: {
		id: "ring-of-fire",
		title: "Ring of Fire",
		description:
			"Create a ring of ethereal fire that boosts damage for you and allies. Normal enemies who enter gain a burning effect that deals fire damage. Last 15 seconds.",
		image: "/field-upgrades/ring-of-fire.avif",
	},
	aetherShroud: {
		id: "aether-shroud",
		title: "Aether Shroud",
		description: "Phase into the Dark Aether and become temporarily hidden from enemy detection.",
		image: "/field-upgrades/aether-shroud.avif",
		augments: [
			groupShroud,
			burstDash,
			voidSheath,
			instantReload,
			extraCharge,
			extensionAetherShroud,
		],
	},
	frenziedGuard: {
		id: "frenzied-guard",
		title: "Frenzied Guard",
		description:
			"Repair armor to full and force all enemies in the area to temporarily target you. Armor takes all damage during this time, and is repaired on every kill.",
		image: "/field-upgrades/frenzied-guard.avif",
		augments: [phalanx, retribution, frenzyFire, repairBoost, extensionFrenziedGuard, rally],
	},
	darkFlare: {
		id: "dark-flare",
		title: "Dark Flare",
		description:
			"Generate an energy beam that deals lethal shadow damage and penetrates everything in its path.",
		image: "/field-upgrades/dark-flare.avif",
		augments: [extensionDarkFlare, supernova, darkPact, broadBeam, heavyShadow, extraCharge],
	},
	energyMine: {
		id: "energy-mine",
		title: "Energy Mine",
		description: "Create a mine of pure energy that detonates 3 times, dealing lethal damage.",
		image: "/field-upgrades/energy-mine.avif",
		augments: [scatter, turret, carousel, frequencyBoost, extraCharge, siren],
	},
	teslaStorm: {
		id: "tesla-storm",
		title: "Tesla Storm",
		description:
			"For 10 seconds lightning connects to other players, stunning and damaging normal enemies.",
		image: "/field-upgrades/tesla-storm.avif",
		augments: [transformer, shockwave, staticDischarge, powerGrid, overclocked, lithiumCharged],
	},
	misterPeeks: {
		id: "mister-peeks",
		title: "Mister Peeks",
		description: "Summon Mister Peeks to our reality to create chaos.",
		image: "/field-upgrades/mister-peeks.avif",
		augments: [danceParty, arcaneFury, apexHunter, socialButterfly, peeksFavor, partyAnimal],
	},
} satisfies Record<string, FieldUpgrade>

export type FieldUpgradeKey = keyof typeof fieldUpgradeRegistry
export const {
	ringOfFire,
	aetherShroud,
	frenziedGuard,
	darkFlare,
	energyMine,
	teslaStorm,
	misterPeeks,
} = fieldUpgradeRegistry
