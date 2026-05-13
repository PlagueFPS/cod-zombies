import type { MapsImagePath, ZombiesImagePath } from "@/types/generated/image-paths.gen"
import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Array as Arr, Effect, FileSystem, Match, Option, Path, Schema, Semaphore } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { getGameByKey } from "@/data/games"
import { getMapByKey, getMapsWithMainQuest, type MapEntry, type MapKey } from "@/data/maps"
import {
	getSideQuestByKey,
	getSideQuests,
	type SideQuest,
	type SideQuestKey,
} from "@/data/side-quests"
import { getZombieByKey, getZombies, type Zombie, type ZombieKey } from "@/data/zombies"
import { DATE_OPTIONS } from "@/utils/constants"
import { calculateTimeToRead } from "@/utils/server-functions"
import {
	decodeOpengraphManifest,
	encodeOpengraphManifest,
	OpengraphManifest,
	type OpengraphKind,
} from "@/utils/validation-schemas"

/** ISO `YYYY-MM-DD` calendar day → long date in en-US; UTC avoids shifting the printed day by local TZ. */
function formatMapReleaseDay(isoDateOnly: string): string {
	return new Intl.DateTimeFormat("en-US", { ...DATE_OPTIONS, timeZone: "UTC" }).format(
		new Date(`${isoDateOnly}T00:00:00Z`),
	)
}

const DEFAULT_OUTPUT_BASE = "public/opengraph-images"

/** When set (e.g. in tests), overrides the manifest path so CLI runs do not mutate repo `data/`. */
const manifestPathFromEnv = () =>
	process.env.OG_TEST_MANIFEST_PATH?.length ? process.env.OG_TEST_MANIFEST_PATH : undefined

export class ImageGenerationError extends Schema.TaggedErrorClass<ImageGenerationError>()(
	"ImageGenerationError",
	{
		cause: Schema.Unknown,
	},
) {}

export class OgCliError extends Schema.TaggedErrorClass<OgCliError>()("OgCliError", {
	message: Schema.String,
}) {}

/** OG canvas OG_IMAGE_SIZE (matches `ImageResponse` / sharp output). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

const getFonts = Effect.fnUntraced(
	function* () {
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const [geistSemiBold, geistBold] = yield* Effect.all(
			[
				fs.readFile(path.join(process.cwd(), "assets/Geist-SemiBold.otf")),
				fs.readFile(path.join(process.cwd(), "assets/Geist-Bold.otf")),
			],
			{ concurrency: "unbounded" },
		)

		return { geistSemiBold, geistBold }
	},
	self => Effect.withLogSpan(self, "getFonts"),
)

const transformImage = Effect.fnUntraced(
	function* (imagePath: MapsImagePath | ZombiesImagePath) {
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const imageBuffer = yield* fs.readFile(path.join(process.cwd(), "public", imagePath))
		return yield* Effect.tryPromise({
			try: () => sharp(imageBuffer).jpeg({ mozjpeg: true, quality: 100 }).toBuffer(),
			catch: cause => new ImageGenerationError({ cause }),
		})
	},
	self => Effect.withLogSpan(self, "transformImage"),
)

const optimizeImageResponse = Effect.fnUntraced(
	function* (imageResponse: ImageResponse) {
		const imageBuffer = yield* Effect.tryPromise({
			try: () => imageResponse.arrayBuffer(),
			catch: cause => new ImageGenerationError({ cause }),
		})
		return yield* Effect.tryPromise({
			try: () => sharp(imageBuffer).jpeg({ mozjpeg: true, quality: 80 }).toBuffer(),
			catch: cause => new ImageGenerationError({ cause }),
		})
	},
	self => Effect.withLogSpan(self, "optimizeImageResponse"),
)

export const generateMainQuestImage = Effect.fnUntraced(
	function* (map: MapEntry) {
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const mainQuestPath = yield* map.mainQuest
		const contentPath = path.join(process.cwd(), `${mainQuestPath}.mdx`)
		const fileContent = yield* fs.readFileString(contentPath)
		const fonts = yield* getFonts()
		const mapImage = yield* transformImage(map.image)
		const timeToRead = calculateTimeToRead(fileContent)
		const game = yield* getGameByKey(map.game)

		const difficultyCSS: React.CSSProperties = Option.match(map.difficulty, {
			onNone: () => ({}),
			onSome: difficulty =>
				Match.value(difficulty).pipe(
					Match.when("Easy", () => ({
						color: "hsl(169 83.8% 78.2%)",
						backgroundImage:
							"radial-gradient(circle at top, hsl(176 69.4% 21.8%), hsl(176 60.8% 19%))",
						border: "1px solid hsl(175 83.9% 31.6%)",
					})),
					Match.when("Medium", () => ({
						color: "hsl(53 98.3% 76.9%)",
						backgroundImage:
							"radial-gradient(circle at top, hsl(32 81% 28.8%), hsl(28 72.5% 25.7%))",
						border: "1px solid hsl(41 96.1% 40.4%)",
					})),
					Match.when("Hard", () => ({
						color: "hsl(0 96.3% 89.4%)",
						backgroundImage: "radial-gradient(circle at top, hsl(0 70% 35.3%), hsl(0 62.8% 30.6%))",
						border: "1px solid hsl(0 72.2% 50.6%)",
					})),
					Match.exhaustive,
				),
		})

		const imageResponse = new ImageResponse(
			<div
				style={{
					position: "relative",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					width: "100%",
					backgroundColor: "black",
				}}
			>
				{/* oxlint-disable-next-line nextjs/no-img-element -- Satori context; next/image is not supported */}
				<img
					// @ts-expect-error: Satori supports ArrayBuffers as values to the src property
					src={mapImage.buffer}
					alt={map.title}
					width={1200}
					height={630}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						opacity: 1,
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundImage:
							"linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "13rem",
						left: "4rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
					}}
				>
					<span
						style={{
							padding: "0.25rem 0.625rem",
							border: "1px solid hsl(25 95% 53.1%)",
							borderRadius: "9999px",
							color: "hsl(32 97.7% 83.1%)",
							fontWeight: "600",
							fontSize: "1rem",
							backgroundImage:
								"radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
						}}
					>
						{game.title}
					</span>
					{Option.match(map.difficulty, {
						onNone: () => null,
						onSome: difficulty => (
							<span
								style={{
									...difficultyCSS,
									borderRadius: "9999px",
									fontWeight: "600",
									fontSize: "1rem",
									padding: "0.25rem 0.625rem",
								}}
							>
								{difficulty}
							</span>
						),
					})}
				</div>
				<h1
					style={{
						position: "absolute",
						bottom: "5rem",
						left: "4rem",
						textAlign: "center",
						color: "white",
						fontSize: "4.5rem",
						letterSpacing: "-0.025em",
						fontWeight: "700",
					}}
				>
					<span
						style={{
							paddingBottom: "1rem",
							color: "transparent",
							backgroundClip: "text",
							backgroundImage: "linear-gradient(to bottom, hsl(0 0% 100%), hsl(0, 0%, 40%))",
						}}
					>
						{map.title}
					</span>
				</h1>
				<div
					style={{
						position: "absolute",
						bottom: "5.5rem",
						left: "4rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.5rem",
						color: "hsl(24 5.4% 63.9%)",
						fontWeight: "600",
						fontSize: "1.25rem",
					}}
				>
					<span>{formatMapReleaseDay(map.releaseDate)}</span>
					<span>&bull;</span>
					<span>{timeToRead} min read</span>
				</div>
			</div>,
			{
				fonts: fonts
					? [
							{
								name: "Geist-SemiBold",
								data: Buffer.from(fonts.geistSemiBold),
								style: "normal",
								weight: 600,
							},
							{
								name: "Geist-Bold",
								data: Buffer.from(fonts.geistBold),
								style: "normal",
								weight: 700,
							},
						]
					: undefined,
				...OG_IMAGE_SIZE,
			},
		)

		return yield* optimizeImageResponse(imageResponse)
	},
	self => Effect.withLogSpan(self, "generateMainQuestImage"),
)

export const generateSideQuestImage = Effect.fnUntraced(
	function* (sideQuest: SideQuest) {
		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const contentPath = path.join(process.cwd(), `${sideQuest.content}.mdx`)
		const fileContent = yield* fs.readFileString(contentPath)
		const fonts = yield* getFonts()
		const timeToRead = calculateTimeToRead(fileContent)
		const map = yield* getMapByKey(sideQuest.map)
		const game = yield* getGameByKey(map.game)
		const mapImage = yield* transformImage(map.image)

		const imageResponse = new ImageResponse(
			<div
				style={{
					position: "relative",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					width: "100%",
					backgroundColor: "black",
				}}
			>
				{/* oxlint-disable-next-line nextjs/no-img-element -- next/image is not allowed here */}
				<img
					// @ts-expect-error: Satori supports ArrayBuffers as values to the src property
					src={mapImage.buffer}
					alt={map.title}
					width={1200}
					height={630}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						opacity: 1,
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						right: "0",
						bottom: "0",
						backgroundImage:
							"linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "13rem",
						left: "4rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
					}}
				>
					<span
						style={{
							padding: "0.25rem 0.625rem",
							border: "1px solid hsl(25 95% 53.1%)",
							borderRadius: "9999px",
							color: "hsl(32 97.7% 83.1%)",
							fontWeight: "600",
							fontSize: "1rem",
							backgroundImage:
								"radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
						}}
					>
						{game.title}
					</span>
					<span
						style={{
							padding: "0.25rem 0.625rem",
							border: "1px solid hsl(25 95% 53.1%)",
							borderRadius: "9999px",
							color: "hsl(32 97.7% 83.1%)",
							fontWeight: "600",
							fontSize: "1rem",
							backgroundImage:
								"radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
						}}
					>
						{map.title}
					</span>
				</div>
				<h1
					style={{
						position: "absolute",
						bottom: "5rem",
						left: "4rem",
						textAlign: "center",
						color: "white",
						fontSize: "4.5rem",
						letterSpacing: "-0.025em",
						fontWeight: "700",
					}}
				>
					<span
						style={{
							paddingBottom: "1rem",
							color: "transparent",
							backgroundClip: "text",
							backgroundImage: "linear-gradient(to bottom, hsl(0 0% 100%), hsl(0, 0%, 40%))",
						}}
					>
						{sideQuest.title}
					</span>
				</h1>
				<div
					style={{
						position: "absolute",
						bottom: "5.5rem",
						left: "4rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.5rem",
						color: "hsl(24 5.4% 63.9%)",
						fontWeight: "600",
						fontSize: "1.25rem",
					}}
				>
					<span>{formatMapReleaseDay(map.releaseDate)}</span>
					<span>&bull;</span>
					<span>{timeToRead} min read</span>
				</div>
			</div>,
			{
				fonts: fonts
					? [
							{
								name: "Geist-SemiBold",
								data: Buffer.from(fonts.geistSemiBold),
								style: "normal",
								weight: 600,
							},
							{
								name: "Geist-Bold",
								data: Buffer.from(fonts.geistBold),
								style: "normal",
								weight: 700,
							},
						]
					: undefined,
				...OG_IMAGE_SIZE,
			},
		)

		return yield* optimizeImageResponse(imageResponse)
	},
	self => Effect.withLogSpan(self, "generateSideQuestImage"),
)

export const generateZombieImage = Effect.fnUntraced(
	function* (zombie: Zombie) {
		const fonts = yield* getFonts()
		const firstAppearedIn = yield* Arr.head(zombie.maps).pipe(
			Option.flatMap(mapKey => getMapByKey(mapKey)),
		)
		const zombieImage = yield* transformImage(zombie.image)

		const typeCSS: React.CSSProperties = Match.value(zombie.type).pipe(
			Match.when("Normal", () => ({
				color: "hsl(169 83.8% 78.2%)",
				backgroundImage: "radial-gradient(circle at top, hsl(176 69.4% 21.8%), hsl(176 60.8% 19%))",
				border: "1px solid hsl(175 83.9% 31.6%)",
			})),
			Match.when("Special", () => ({
				color: "hsl(53 98.3% 76.9%)",
				backgroundImage: "radial-gradient(circle at top, hsl(32 81% 28.8%), hsl(28 72.5% 25.7%))",
				border: "1px solid hsl(41 96.1% 40.4%)",
			})),
			Match.when("Elite", () => ({
				color: "hsl(353 96.1% 90%)",
				backgroundImage:
					"radial-gradient(circle at top, hsl(343 79.7% 34.7%), hsl(342 75.5% 30.4%))",
				border: "1px solid hsl(347 77.2% 49.8%)",
			})),
			Match.when("Boss", () => ({
				color: "hsl(0 96.3% 89.4%)",
				backgroundImage: "radial-gradient(circle at top, hsl(0 70% 35.3%), hsl(0 62.8% 30.6%))",
				border: "1px solid hsl(0 72.2% 50.6%)",
			})),
			Match.exhaustive,
		)

		const imageResponse = new ImageResponse(
			<div
				style={{
					position: "relative",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					width: "100%",
					backgroundColor: "black",
				}}
			>
				{/* oxlint-disable-next-line nextjs/no-img-element -- next/image is not allowed here */}
				<img
					// @ts-expect-error
					src={zombieImage.buffer}
					alt={zombie.title}
					width={1200}
					height={630}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "top",
						opacity: 1,
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundImage:
							"linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "13rem",
						left: "4rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
					}}
				>
					<span
						style={{
							padding: "0.25rem 0.625rem",
							border: "1px solid hsl(25 95% 53.1%)",
							borderRadius: "9999px",
							color: "hsl(32 97.7% 83.1%)",
							fontWeight: "600",
							fontSize: "1rem",
							backgroundImage:
								"radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
						}}
					>
						{firstAppearedIn.title}
					</span>
					<span
						style={{
							...typeCSS,
							borderRadius: "9999px",
							fontWeight: "600",
							fontSize: "1rem",
							padding: "0.25rem 0.625rem",
						}}
					>
						{zombie.type}
					</span>
				</div>
				<h1
					style={{
						position: "absolute",
						bottom: "5rem",
						left: "4rem",
						textAlign: "center",
						color: "white",
						fontSize: "4.5rem",
						letterSpacing: "-0.025em",
						fontWeight: "700",
					}}
				>
					<span
						style={{
							paddingBottom: "1rem",
							color: "transparent",
							backgroundClip: "text",
							backgroundImage: "linear-gradient(to bottom, hsl(0 0% 100%), hsl(0, 0%, 40%))",
						}}
					>
						{zombie.title}
					</span>
				</h1>
				<div
					style={{
						position: "absolute",
						bottom: "5.5rem",
						left: "4rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.5rem",
						color: "hsl(24 5.4% 63.9%)",
						fontWeight: "600",
						fontSize: "1.25rem",
					}}
				>
					<span>{formatMapReleaseDay(zombie.releaseDate)}</span>
				</div>
			</div>,
			{
				fonts: fonts
					? [
							{
								name: "Geist-SemiBold",
								data: Buffer.from(fonts.geistSemiBold),
								style: "normal",
								weight: 600,
							},
							{
								name: "Geist-Bold",
								data: Buffer.from(fonts.geistBold),
								style: "normal",
								weight: 700,
							},
						]
					: undefined,
				...OG_IMAGE_SIZE,
			},
		)

		return yield* optimizeImageResponse(imageResponse)
	},
	self => Effect.withLogSpan(self, "generateZombieImage"),
)

export const writeOgFile = Effect.fnUntraced(function* (
	outputBase: string,
	contentDir: OpengraphKind,
	fileBaseName: string,
	bytes: Uint8Array,
	options?: { manifestPath?: string },
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const dir = path.join(outputBase, contentDir)
	const manifestPath =
		options?.manifestPath ??
		manifestPathFromEnv() ??
		path.join(process.cwd(), "data", "opengraph-manifest.json")

	const manifest = yield* fs
		.readFileString(manifestPath)
		.pipe(Effect.flatMap(decodeOpengraphManifest))
	const version = Option.match(Option.fromUndefinedOr(manifest[contentDir][fileBaseName]), {
		onNone: () => 1,
		onSome: previousVersion => previousVersion + 1,
	})

	const oldPath = path.join(dir, `opengraph-${fileBaseName}-v${version - 1}.jpg`)
	const outPath = path.join(dir, `opengraph-${fileBaseName}-v${version}.jpg`)
	yield* fs.makeDirectory(dir, { recursive: true })
	yield* fs.writeFile(outPath, bytes)

	const updatedManifest = new OpengraphManifest(
		{
			// oxlint-disable-next-line no-misused-spread, we're constructing a new instance of the manifest
			...manifest,
			[contentDir]: {
				...manifest[contentDir],
				[fileBaseName]: version,
			},
		},
		{ disableChecks: true },
	)

	yield* fs.writeFileString(manifestPath, yield* encodeOpengraphManifest(updatedManifest))
	yield* Effect.log(`Wrote ${outPath}`)

	yield* Effect.filterOrElse(
		fs.exists(oldPath),
		exists => !exists,
		() => fs.remove(oldPath),
	)
})

const mapSlugFlag = Flag.optional(Flag.string("map")).pipe(
	Flag.withAlias("m"),
	Flag.withDescription(
		"Map slug: one main-quest OG image when used alone, or filter for --zombies / --quests (batch only).",
	),
)

const mapsFlag = Flag.boolean("maps").pipe(
	Flag.withDescription("Generate OG images for every map that has a main quest."),
)

const questFlag = Flag.optional(Flag.string("quest")).pipe(
	Flag.withAlias("q"),
	Flag.withDescription("Side quest slug for one OG image."),
)

const questsFlag = Flag.boolean("quests").pipe(
	Flag.withDescription(
		"Generate OG images for all side quests (optional --map / -m limits to that map).",
	),
)

const zombieFlag = Flag.optional(Flag.string("zombie")).pipe(
	Flag.withAlias("z"),
	Flag.withDescription("Zombie slug for one OG image."),
)

const zombiesFlag = Flag.boolean("zombies").pipe(
	Flag.withDescription(
		"Generate OG images for all zombies (optional --map / -m limits to zombies that were released on that map).",
	),
)

const outputDirFlag = Flag.directory("output-dir").pipe(
	Flag.withDefault(DEFAULT_OUTPUT_BASE),
	Flag.withAlias("o"),
	Flag.withDescription(
		`Base output directory (default: ${DEFAULT_OUTPUT_BASE}). Images go to <dir>/<content-type>/<slug>.jpg`,
	),
)

export const generateOgCommand = Command.make(
	"generate-og-images",
	{
		mapFlag: mapSlugFlag,
		mapsFlag: mapsFlag,
		questFlag: questFlag,
		questsFlag: questsFlag,
		zombieFlag: zombieFlag,
		zombiesFlag: zombiesFlag,
		outputDirFlag: outputDirFlag,
	},
	({ mapFlag, mapsFlag, questFlag, questsFlag, zombieFlag, zombiesFlag, outputDirFlag }) =>
		Effect.gen(function* () {
			const path = yield* Path.Path
			const outputBase = path.resolve(outputDirFlag)
			const manifestLock = yield* Semaphore.make(1)

			const zombieFamily = zombiesFlag || Option.isSome(zombieFlag)
			const questFamily = questsFlag || Option.isSome(questFlag)
			const mainFamily = mapsFlag || (Option.isSome(mapFlag) && !zombieFamily && !questFamily)

			const modeCount = (zombieFamily ? 1 : 0) + (questFamily ? 1 : 0) + (mainFamily ? 1 : 0)

			if (modeCount !== 1) {
				return yield* new OgCliError({
					message:
						"Specify exactly one target: --maps, --map <id>, --quests [--map <id>], --quest <id>, --zombies [--map <id>], or --zombie <id>.",
				})
			}

			if (zombieFamily) {
				if (zombiesFlag && Option.isSome(zombieFlag)) {
					return yield* new OgCliError({
						message: "Use either --zombies or --zombie <id>, not both.",
					})
				}
				if (Option.isSome(zombieFlag) && Option.isSome(mapFlag)) {
					return yield* new OgCliError({
						message: "--map is only valid with --zombies (batch), not with --zombie <id>.",
					})
				}

				if (Option.isSome(zombieFlag)) {
					const zombie = yield* getZombieByKey(zombieFlag.value as ZombieKey)
					const ogImage = yield* generateZombieImage(zombie)
					yield* writeOgFile(outputBase, "zombies", zombie.id, new Uint8Array(ogImage))
					return
				}

				const zombies = Option.match(mapFlag, {
					onNone: () => getZombies(),
					onSome: mapKey => getZombies().filter(z => Arr.head(z.maps).valueOrUndefined === mapKey),
				})
				if (!zombies.length) {
					return yield* new OgCliError({
						message: Option.match(mapFlag, {
							onNone: () => "No zombies found in the catalog.",
							onSome: mapKey => `No zombies found for map ${mapKey}`,
						}),
					})
				}

				yield* Effect.forEach(
					zombies,
					z =>
						Effect.gen(function* () {
							const ogImage = yield* generateZombieImage(z)
							yield* manifestLock.withPermits(1)(
								writeOgFile(outputBase, "zombies", z.id, new Uint8Array(ogImage)),
							)
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (questFamily) {
				if (questsFlag && Option.isSome(questFlag)) {
					return yield* new OgCliError({
						message: "Use either --quests or --quest <id>, not both.",
					})
				}
				if (Option.isSome(questFlag) && Option.isSome(mapFlag)) {
					return yield* new OgCliError({
						message: "--map is only valid with --quests (batch), not with --quest <id>.",
					})
				}

				if (Option.isSome(questFlag)) {
					const questEntry = yield* getSideQuestByKey(questFlag.value as SideQuestKey)
					const ogImage = yield* generateSideQuestImage(questEntry)
					yield* writeOgFile(outputBase, "side-quests", questEntry.id, new Uint8Array(ogImage))
					return
				}

				const quests = Option.match(mapFlag, {
					onNone: () => getSideQuests(),
					onSome: mapKey => getSideQuests().filter(q => q.map === (mapKey as MapKey)),
				})
				if (!quests.length) {
					return yield* new OgCliError({
						message: Option.match(mapFlag, {
							onNone: () => "No side quests found in the catalog.",
							onSome: mapKey => `No side quests found for map ${mapKey}`,
						}),
					})
				}

				yield* Effect.forEach(
					quests,
					q =>
						Effect.gen(function* () {
							const ogImage = yield* generateSideQuestImage(q)
							yield* manifestLock.withPermits(1)(
								writeOgFile(outputBase, "side-quests", q.id, new Uint8Array(ogImage)),
							)
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (mapsFlag && Option.isSome(mapFlag)) {
				return yield* new OgCliError({
					message:
						"--maps already generates every main quest; omit --map or use --map <id> alone for one map.",
				})
			}

			if (mapsFlag) {
				const maps = getMapsWithMainQuest()
				if (!maps.length) {
					return yield* new OgCliError({
						message: "No maps with main quests found in the catalog.",
					})
				}

				yield* Effect.forEach(
					maps,
					m =>
						Effect.gen(function* () {
							const ogImage = yield* generateMainQuestImage(m)
							yield* manifestLock.withPermits(1)(
								writeOgFile(outputBase, "main-quests", m.id, new Uint8Array(ogImage)),
							)
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (Option.isSome(mapFlag)) {
				const map = yield* getMapByKey(mapFlag.value as MapKey)
				const ogImage = yield* generateMainQuestImage(map)
				yield* writeOgFile(outputBase, "main-quests", map.id, new Uint8Array(ogImage))
				return
			}

			return yield* new OgCliError({
				message:
					"Specify --maps, --map <id>, --quests [--map <id>], --quest <id>, --zombies [--map <id>], or --zombie <id>.",
			})
		}),
)

if (import.meta.main) {
	Command.run(generateOgCommand, {
		version: "1.0.0",
	}).pipe(Effect.withLogSpan("generate_og_images"), Effect.provide(BunServicesLayer), runMain)
}
