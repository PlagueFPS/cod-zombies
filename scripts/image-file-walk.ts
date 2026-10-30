import { Effect, FileSystem, HashSet, Path, String as Str, Array as Arr } from "effect"
import { isVariantImagePath, toWebImagePath } from "@/lib/image-variant-paths"
import { SUPPORTED_IMAGE_FORMATS } from "@/scripts/utils"

export type ImagePathFormat = "relative" | "web"

export type WalkImageFilesOptions = {
	readonly format: ImagePathFormat
	readonly includeVariants: boolean
}

export const walkImageFiles = Effect.fn("walkImageFiles")(function* (
	rootDir: string,
	options: WalkImageFilesOptions,
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const matches = yield* fs.glob("**/*", { root: rootDir })

	const images = Arr.filter(matches, file =>
		HashSet.has(SUPPORTED_IMAGE_FORMATS, Str.toLowerCase(path.extname(file))),
	)

	const files = yield* Effect.filter(images, file =>
		fs.stat(path.join(rootDir, file)).pipe(Effect.map(stat => stat.type === "File")),
	)

	return Arr.map(
		Arr.filter(files, file => options.includeVariants || !isVariantImagePath(toWebImagePath(file))),
		file => (options.format === "web" ? `/${file}` : file),
	)
})
