import { FileSystem, Path } from "@effect/platform"
import { BunFileSystem, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, Match, Option } from "effect"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { getMainQuestByMap, type MainQuest } from "@/data/main-quests"
import { calculateTimeToRead, getLastUpdated } from "@/utils/functions"

const size = { width: 1200, height: 630 }
const FsLayer = Layer.merge(BunFileSystem.layer, Path.layer)

const getFonts = Effect.fn("getFonts")(function* () {
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
})

export const generateMainQuestImage = Effect.fn("generateMainQuestImage")(function* (
	mainQuest: MainQuest,
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const contentPath = path.join(process.cwd(), `./content/main-quests/${mainQuest.id}.mdx`)
	const fileContent = yield* fs.readFileString(contentPath)
	const fonts = yield* getFonts()
	const timeToRead = calculateTimeToRead(fileContent)
	const { lastModifiedFormatted } = getLastUpdated(contentPath)

	const mapBuffer = yield* fs.readFile(path.join(process.cwd(), "public", mainQuest.map.image))

	const mapImage = yield* Effect.tryPromise({
		try: () => sharp(mapBuffer).jpeg({ mozjpeg: true, quality: 100 }).toBuffer(),
		catch: error => new Error(`Failed to generate map image`, { cause: error }),
	})

	const difficultyCSS: React.CSSProperties = Option.match(mainQuest.difficulty, {
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
					backgroundImage: "radial-gradient(circle at top, hsl(32 81% 28.8%), hsl(28 72.5% 25.7%))",
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
			{/*biome-ignore lint/performance/noImgElement: next/image is not supported in this context*/}
			<img
				// @ts-expect-error: Satori supports ArrayBuffers as values to the src property
				src={mapImage.buffer}
				alt={mainQuest.map.title}
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
					bottom: "14rem",
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
					{mainQuest.map.game.title}
				</span>
				{Option.match(mainQuest.difficulty, {
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
					{mainQuest.map.title}
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
				<span>{lastModifiedFormatted}</span>
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
			...size,
		},
	)

	const imageBuffer = yield* Effect.tryPromise({
		try: () => imageResponse.arrayBuffer(),
		catch: error => new Error("Failed to get array buffer", { cause: error }),
	})

	const optimizedBuffer = yield* Effect.tryPromise({
		try: () => sharp(imageBuffer).jpeg({ mozjpeg: true, quality: 80 }).toBuffer(),
		catch: error => new Error("Failed to optimize image", { cause: error }),
	})

	return optimizedBuffer
})

const program = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const quest = getMainQuestByMap("ashes-of-the-damned")
	if (!quest) return yield* Effect.fail("Quest not found")

	const ogImage = yield* generateMainQuestImage(quest)
	yield* fs.writeFile(
		path.join(process.cwd(), "public", `opengraph-images/main-quests/og-${quest.map.id}.jpg`),
		new Uint8Array(ogImage),
	)
	yield* Effect.log(`Generated og image for ${quest.map.id}`)
}).pipe(Effect.provide(FsLayer))

BunRuntime.runMain(program)
