import type { TAllowedSlugs } from "@/utils/validation-schemas"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Effect } from "effect"
import { LoadFontDataError } from "@/types/errors"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { getMapById } from "./maps"
import { getQuestById } from "./side-quests"
import { getZombieById } from "./zombies"

export const getFontData = Effect.gen(function* () {
	const [geistSemiBold, geistBold] = yield* Effect.all(
		[
			Effect.tryPromise({
				try: () => readFile(join(process.cwd(), "assets/Geist-SemiBold.otf")),
				catch: error =>
					new LoadFontDataError({ message: "Failed to load `Geist-SemiBold` font", cause: error }),
			}),
			Effect.tryPromise({
				try: () => readFile(join(process.cwd(), "assets/Geist-Bold.otf")),
				catch: error =>
					new LoadFontDataError({ message: "Failed to load `Geist-Bold` font", cause: error }),
			}),
		],
		{ concurrency: "unbounded" },
	)

	return { geistSemiBold, geistBold }
}).pipe(
	Effect.withLogSpan("get_font_data"),
	Effect.tapError(Effect.logError),
	Effect.catchAll(() => Effect.succeed(null)),
)

export const getImageDataForType = Effect.fnUntraced(function* (type: TAllowedSlugs, id: string) {
	switch (type) {
		case "maps": {
			const map = yield* Effect.promise(() => getMapById(IN_DEVELOPMENT, id))
			if (!map) return null
			return { url: map.image.url, id: map.id, slug: map.slug }
		}
		case "zombies": {
			const zombie = yield* Effect.promise(() => getZombieById(IN_DEVELOPMENT, id))
			if (!zombie) return null
			return { url: zombie.image.url, id: zombie.id, slug: zombie.slug }
		}
		case "side-quests": {
			const sideQuest = yield* Effect.promise(() => getQuestById(IN_DEVELOPMENT, id))
			if (!sideQuest) return null
			return { url: sideQuest.image.url, id: sideQuest.id, slug: sideQuest.slug }
		}
		default:
			return null
	}
}, Effect.withLogSpan("get_image_data_for_type"))
