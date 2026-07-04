import type { PlatformError } from "effect/PlatformError"
import { Effect, FileSystem, HashSet, Path } from "effect"
import { isVariantImagePath, toWebImagePath } from "@/lib/image-variant-paths"
import { SUPPORTED_IMAGE_FORMATS } from "@/scripts/utils"

export type ImagePathFormat = "relative" | "web"

export type WalkImageFilesOptions = {
	readonly format: ImagePathFormat
	readonly includeVariants: boolean
}

const formatImagePath = (
	rootDir: string,
	absolutePath: string,
	format: ImagePathFormat,
	path: Path.Path,
): string => {
	const relative = path.relative(rootDir, absolutePath).split(path.sep).join("/")
	return format === "web" ? `/${relative}` : relative
}

export const walkImageFiles = Effect.fn("walkImageFiles")(function* (
	rootDir: string,
	options: WalkImageFilesOptions,
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const results: string[] = []

	const walk = (
		current: string,
	): Effect.Effect<void, PlatformError, Path.Path | FileSystem.FileSystem> =>
		Effect.gen(function* () {
			const files = yield* fs.readDirectory(current)
			yield* Effect.forEach(
				files,
				file =>
					Effect.gen(function* () {
						if (file.startsWith(".")) return

						const full = path.join(current, file)
						const stat = yield* fs.stat(full)

						if (stat.type === "Directory") {
							yield* walk(full)
							return
						}

						if (stat.type !== "File") return

						const ext = path.extname(file).toLowerCase()
						if (!HashSet.has(SUPPORTED_IMAGE_FORMATS, ext)) return

						const formatted = formatImagePath(rootDir, full, options.format, path)
						if (!options.includeVariants && isVariantImagePath(toWebImagePath(formatted))) {
							return
						}

						results.push(formatted)
					}),
				{ concurrency: "unbounded" },
			)
		})

	yield* walk(rootDir)
	return results
})
