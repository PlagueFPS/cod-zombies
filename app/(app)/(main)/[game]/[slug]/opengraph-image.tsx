import { FetchHttpClient } from "@effect/platform"
import { Effect, Layer } from "effect"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { getMainQuestBySlug } from "@/data/main-quests"
import { getFonts, optimizeImageForOG } from "@/data/og-images"
import { FileStorage } from "@/lib/services/file-storage"
import { OgImageGenerationError } from "@/types/errors"
import { DATE_OPTIONS } from "@/utils/constants"

export const alt = "Main Quest Guide Preview"
export const size = {
	width: 1200,
	height: 630,
}
export const contentType = "image/png"

export default async function MainQuestImage({ params }: PageProps<"/[game]/[slug]">) {
	return await Effect.gen(function* () {
		const { slug } = yield* Effect.promise(() => params)
		const quest = yield* Effect.promise(() => getMainQuestBySlug(slug))
		if (!quest?.image.url)
			return yield* new OgImageGenerationError({
				message: `No image URL found for quest ${quest?.slug}`,
			})

		const { boldFont, semiBoldFont } = yield* getFonts
		const supportedImage = yield* optimizeImageForOG(quest.image.url)

		const getDifficultyCSSProps = (): React.CSSProperties => {
			switch (quest?.difficulty) {
				case "Easy":
					return {
						color: "hsl(169 85% 78%)",
						backgroundImage: "radial-gradient(circle at top, hsl(177 100% 19%), hsl(176 76% 18%))",
						border: "1px solid hsl(175 100% 29%)",
					}
				case "Medium":
					return {
						color: "hsl(53 99% 76%)",
						backgroundImage: "radial-gradient(circle at top, hsl(33 100% 27%), hsl(30 83% 25%))",
						border: "1px solid hsl(39 100% 41%)",
					}
				case "Hard":
					return {
						color: "hsl(360 100% 90%)",
						backgroundImage: "radial-gradient(circle at top, hsl(356 91% 33%), hsl(359 69% 30%))",
						border: "1px solid hsl(357 100% 45%)",
					}
				default:
					return {}
			}
		}

		const res = new ImageResponse(
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
				{/* biome-ignore lint/performance/noImgElement: next/image is not allowed here */}
				<img
					// @ts-expect-error Satori accepts ArrayBuffer/typed arrays for <img> at runtime.
					src={supportedImage.buffer}
					alt={quest.title}
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
							border: "1px solid hsl(20 88% 49%)",
							borderRadius: "9999px",
							color: "hsl(32 100% 83%)",
							fontWeight: "600",
							fontSize: "1rem",
							backgroundImage: "radial-gradient(circle at top, hsl(17 100% 31%), hsl(16 83% 27%))",
						}}
					>
						{quest.game.title}
					</span>
					<span
						style={{
							...getDifficultyCSSProps(),
							borderRadius: "9999px",
							fontWeight: "600",
							fontSize: "1rem",
							padding: "0.25rem 0.625rem",
						}}
					>
						{quest.difficulty}
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
						{quest?.title}
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
					<span>{new Date(quest.updatedAt).toLocaleDateString("en-US", DATE_OPTIONS)}</span>
					<span>&bull;</span>
					<span>{quest.timeToRead} min read</span>
				</div>
			</div>,
			{
				...size,
				fonts: [
					{
						name: "Geist-Bold",
						data: boldFont,
						weight: 700,
					},
					{
						name: "Geist-SemiBold",
						data: semiBoldFont,
						weight: 600,
					},
				],
			},
		)

		const imageBuffer = yield* Effect.tryPromise({
			try: () => res.arrayBuffer(),
			catch: error =>
				new OgImageGenerationError({ message: "Failed to convert to array buffer", cause: error }),
		})

		const optimizedBuffer = yield* Effect.tryPromise({
			try: () => sharp(imageBuffer).png({ quality: 75 }).toBuffer(),
			catch: error =>
				new OgImageGenerationError({ message: "Failed to optimize image", cause: error }),
		}).pipe(Effect.map(buffer => new Uint8Array(buffer)))

		return new Response(optimizedBuffer, {
			headers: res.headers,
			status: res.status,
			statusText: res.statusText,
		})
	}).pipe(
		Effect.withLogSpan("main_quest_og_image_generation"),
		Effect.tapError(Effect.logError),
		Effect.catchTags({
			GetFileError: error => Effect.succeed(new Response(error.message, { status: 404 })),
			ReadFileError: error => Effect.succeed(new Response(error.message, { status: 404 })),
			RequestError: error => Effect.succeed(new Response(error.message, { status: 400 })),
		}),
		Effect.catchAll(error => Effect.succeed(new Response(error.message, { status: 500 }))),
		Effect.ensureErrorType<never>(),
		Effect.provide(Layer.merge(FileStorage.Default, FetchHttpClient.layer)),
		Effect.runPromise,
	)
}
