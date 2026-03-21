import { Option, Predicate } from "effect"
import { Suspense } from "react"

import { GridFilters } from "@/components/client/grid-filters"
import { FilterLoader } from "@/components/server/filter-loader"
import { getAmmoModByKey } from "@/data/ammo-mods"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getZombies } from "@/data/zombies"
import { slugify, sortZombieTypes } from "@/utils/shared-functions"

export function BestiaryFilters() {
	const zombies = getZombies()
	const games = getGames().map(game => ({
		value: game.id,
		label: game.title,
	}))
	const maps = getMaps().map(map => ({
		value: map.id,
		label: map.title,
	}))
	const typeFilters = Array.from(
		new Set(zombies.map(zombie => zombie.type).sort(sortZombieTypes)),
	).map(type => ({
		value: slugify(type),
		label: type,
	}))

	const weaknessFilters = Array.from(new Set(zombies.flatMap(zombie => zombie.elementalWeakness)))
		.map(weakness => {
			return Option.match(getAmmoModByKey(weakness), {
				onSome: ammoMod => ({
					value: weakness,
					label: ammoMod.title,
				}),
				onNone: () => null,
			})
		})
		.filter(Predicate.isNotNull)

	return (
		<Suspense fallback={<FilterLoader placeholder="Type, Game, or Map" />}>
			<GridFilters
				type="zombie"
				games={games}
				maps={maps}
				types={typeFilters}
				weaknesses={weaknessFilters}
				placeholder="Type, Game, Map, or Weakness"
			/>
		</Suspense>
	)
}
