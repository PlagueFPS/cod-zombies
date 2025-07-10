import "server-only"
import { Effect } from "effect"
import { cache } from "react"
import { type MapId, mapRegistry } from "@/map-configs"
import { MapConfigError } from "@/types/errors"

export const getMapConfig = cache((mapId: MapId) =>
	Effect.gen(function* () {
		const config = mapRegistry[mapId]
		return yield* Effect.tryPromise({
			try: () => config,
			catch: error =>
				new MapConfigError({ message: `Failed to get map config for ${mapId}`, cause: error }),
		})
	}).pipe(
		Effect.withLogSpan("get_map_config"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed(null)),
		Effect.runPromise,
	),
)

export const getAvailableMaps = () => {
	return Object.keys(mapRegistry) as MapId[]
}
