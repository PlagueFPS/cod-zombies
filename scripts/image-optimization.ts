import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Clock, Duration, Effect, FileSystem, Path, Schema, Ref, Match } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import sharp, { type Sharp } from "sharp"
import { generateImagePaths } from "@/scripts/generate-image-paths"
import { walkImageFiles } from "@/scripts/image-file-walk"
import {
	getCategoryFromRelativePath,
	getVariantWidths,
	shouldGenerateVariants,
	variantFileName,
} from "@/scripts/image-variant-policy"

export class ImageOptimizationError extends Schema.TaggedErrorClass<ImageOptimizationError>()(
	"ImageOptimizationError",
	{
		message: Schema.String,
		cause: Schema.Unknown,
	},
) {}

const DEFAULT_SOURCE_DIR = "./newassets"
const DEFAULT_COPY_DIR = "./oldassets"
const MAX_EFFORT = 6
const MAX_QUALITY = 80
const DEFAULT_MAX_WIDTH = 1920
const PREVIEW_WIDTH = 640
const MAP_WIDTH = 2048

export type EncodeWebpOptions = {
	readonly withoutEnlargement?: boolean
}

export function encodeWebp(
	image: Sharp,
	width?: number,
	options?: EncodeWebpOptions,
): Promise<Buffer> {
	let pipeline = image.rotate()
	if (width !== undefined) {
		pipeline = pipeline.resize({
			width,
			withoutEnlargement: options?.withoutEnlargement ?? true,
		})
	}
	return pipeline.webp({ effort: MAX_EFFORT, quality: MAX_QUALITY }).toBuffer()
}

const dirOption = Flag.directory("output-dir").pipe(
	Flag.withAlias("o"),
	Flag.withDescription("Output directory where optimized images will be stored. (required)"),
)

const sourceOption = Flag.directory("source-dir").pipe(
	Flag.withDefault(DEFAULT_SOURCE_DIR),
	Flag.withAlias("s"),
	Flag.withDescription(
		`Source directory containing images to optimize. (default: ${DEFAULT_SOURCE_DIR})`,
	),
)

const previewFlag = Flag.boolean("preview").pipe(
	Flag.withDescription("Resize images to 640px width with no variants."),
)

const mapFlag = Flag.boolean("map").pipe(
	Flag.withDescription("Resize images to 2048px width with no variants, without upscaling."),
)

const encodeWebpEffect = Effect.fnUntraced(function* (
	image: Sharp,
	asset: string,
	width?: number,
	options?: EncodeWebpOptions,
) {
	return yield* Effect.tryPromise({
		try: () => encodeWebp(image, width, options),
		catch: cause =>
			new ImageOptimizationError({
				message:
					width === undefined
						? `Failed to encode base image: ${asset}`
						: `Failed to encode ${width}px variant: ${asset}`,
				cause,
			}),
	})
})

const ensureDirectory = Effect.fnUntraced(function* (dir: string) {
	const fs = yield* FileSystem.FileSystem
	yield* Effect.filterOrElse(
		fs.exists(dir),
		exists => exists,
		() => fs.makeDirectory(dir, { recursive: true }),
	)
})

export type OptimizeMode = "default" | "preview" | "map"

export type OptimizeCliOptions = {
	readonly dir: string
	readonly source: string
	readonly preview?: boolean
	readonly map?: boolean
}

export const getOptimizeMode = (args: OptimizeCliOptions): OptimizeMode => {
	if (args.preview) return "preview"
	if (args.map) return "map"
	return "default"
}

export const requireImageWidth = (
	metadata: Readonly<{ width?: number }>,
	asset: string,
): Effect.Effect<number, ImageOptimizationError> => {
	if (metadata.width === undefined) {
		return Effect.fail(
			new ImageOptimizationError({
				message: `Image has no width metadata: ${asset}`,
				cause: asset,
			}),
		)
	}
	return Effect.succeed(metadata.width)
}

export const optimizeAssetsEffect = (args: OptimizeCliOptions) =>
	Effect.gen(function* () {
		if (args.preview && args.map) {
			return yield* new ImageOptimizationError({
				message: "Cannot use --preview and --map together.",
				cause: args,
			})
		}

		const { dir: targetDir, source } = args
		const mode = getOptimizeMode(args)
		const startTime = yield* Clock.currentTimeMillis
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const assets = yield* walkImageFiles(source, {
			format: "relative",
			includeVariants: false,
		})
		const numRef = yield* Ref.make(0)
		const inPlace = path.resolve(source) === path.resolve(targetDir)

		yield* ensureDirectory(targetDir)
		if (!inPlace) {
			yield* ensureDirectory(DEFAULT_COPY_DIR)
		}

		yield* Effect.forEach(
			assets,
			relativeAsset =>
				Effect.gen(function* () {
					const extension = path.extname(relativeAsset)
					const relativeDir = path.dirname(relativeAsset)
					const baseName = path.basename(relativeAsset, extension)
					const category = getCategoryFromRelativePath(relativeAsset)
					const sourcePath = path.join(source, relativeAsset)
					const outputDir = relativeDir === "." ? targetDir : path.join(targetDir, relativeDir)

					yield* ensureDirectory(outputDir)

					const imageBuffer = yield* fs.readFile(sourcePath)
					const image = sharp(imageBuffer)
					const metadata = yield* Effect.tryPromise({
						try: () => image.metadata(),
						catch: cause =>
							new ImageOptimizationError({
								message: `Failed to read image metadata: ${relativeAsset}`,
								cause,
							}),
					})

					const sourceWidth = yield* requireImageWidth(metadata, relativeAsset)

					yield* Effect.log(`Transforming image: ${relativeAsset}`)

					const baseFileName = `${baseName}.webp`
					const baseBuffer = yield* Match.value(mode).pipe(
						Match.when("preview", () =>
							encodeWebpEffect(image, relativeAsset, PREVIEW_WIDTH, {
								withoutEnlargement: false,
							}),
						),
						Match.when("map", () =>
							encodeWebpEffect(image, relativeAsset, MAP_WIDTH, {
								withoutEnlargement: true,
							}),
						),
						Match.orElse(() =>
							encodeWebpEffect(image, relativeAsset, DEFAULT_MAX_WIDTH, {
								withoutEnlargement: true,
							}),
						),
					)

					yield* fs.writeFile(path.join(outputDir, baseFileName), baseBuffer)

					if (mode === "default" && shouldGenerateVariants(category)) {
						const variantWidths = getVariantWidths(sourceWidth)
						yield* Effect.forEach(
							variantWidths,
							width =>
								Effect.gen(function* () {
									const variantBuffer = yield* encodeWebpEffect(image, relativeAsset, width)
									yield* fs.writeFile(
										path.join(outputDir, variantFileName(baseName, width)),
										variantBuffer,
									)
								}),
							{ concurrency: 2 },
						)
					}

					if (!inPlace) {
						const copyDestDir =
							relativeDir === "." ? DEFAULT_COPY_DIR : path.join(DEFAULT_COPY_DIR, relativeDir)
						yield* ensureDirectory(copyDestDir)
						yield* fs.copyFile(sourcePath, path.join(copyDestDir, path.basename(relativeAsset)))
						yield* fs.remove(sourcePath)
					}

					yield* Ref.update(numRef, n => n + 1)
					const currentAsset = yield* Ref.get(numRef)
					yield* Effect.log(
						`Transformed: ${relativeDir === "." ? baseFileName : `${relativeDir}/${baseFileName}`}; ${currentAsset}/${assets.length}`,
					)
				}).pipe(Effect.withLogSpan("transform_asset")),
			{ concurrency: 2 },
		)

		const writtenAmount = yield* Ref.get(numRef)
		const endTime = yield* Clock.currentTimeMillis.pipe(Effect.map(endTime => endTime - startTime))
		const totalTime = Duration.format(Duration.millis(endTime))
		yield* Effect.log(
			`Successfully optimized ${writtenAmount}/${assets.length} images in ${totalTime}!`,
		)
	}).pipe(Effect.withLogSpan("optimize_assets"))

export const optimizeCommand = Command.make(
	"optimize",
	{
		dir: dirOption,
		source: sourceOption,
		preview: previewFlag,
		map: mapFlag,
	},
	(args: OptimizeCliOptions) =>
		optimizeAssetsEffect(args).pipe(
			Effect.tap(() =>
				Effect.gen(function* () {
					yield* Effect.log("Regenerating image paths and variant manifest...")
					yield* generateImagePaths(process.cwd())
				}),
			),
		),
)

if (import.meta.main) {
	Command.run(optimizeCommand, {
		version: "1.0.0",
	}).pipe(Effect.provide(BunServicesLayer), runMain)
}
