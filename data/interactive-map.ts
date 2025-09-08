import { Effect } from "effect"
import { cache } from "react"
import { type MapId, mapRegistry } from "@/map-configs"
import { MapConfigError } from "@/types/errors"

export const getMapConfig = cache(async (mapId: MapId) => {
	"use cache"
	return await getMapConfigEffect(mapId).pipe(
		Effect.withLogSpan("get_map_config_cached"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
})

const getMapConfigEffect = (mapId: MapId) =>
	Effect.tryPromise({
		try: () => mapRegistry[mapId],
		catch: error =>
			new MapConfigError({ message: `Failed to get map config for ${mapId}`, cause: error }),
	}).pipe(Effect.withLogSpan("get_map_config"))

export const getAvailableMaps = () => {
	return Object.keys(mapRegistry) as MapId[]
}
