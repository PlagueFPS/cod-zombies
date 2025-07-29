import type { TAllowedSlugs } from "@/utils/validation-schemas"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { Effect } from "effect"
import { LoadFontDataError } from "@/types/errors"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { getMapBySlug } from "./maps"
import { getQuestBySlug } from "./side-quests"
import { getZombieBySlug } from "./zombies"

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

export const getImageUrlForType = async (type: TAllowedSlugs, slug: string) => {
	switch (type) {
		case "maps": {
			const map = await getMapBySlug(IN_DEVELOPMENT, slug)
			if (!map) return null
			return map.image.url
		}
		case "zombies": {
			const zombie = await getZombieBySlug(IN_DEVELOPMENT, slug)
			if (!zombie) return null
			return zombie.image.url
		}
		case "side-quests": {
			const sideQuest = await getQuestBySlug(IN_DEVELOPMENT, slug)
			if (!sideQuest) return null
			return sideQuest.image.url
		}
		default:
			return null
	}
}
