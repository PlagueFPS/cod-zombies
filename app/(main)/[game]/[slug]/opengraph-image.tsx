import type { CSSProperties } from "react"
import { Effect } from "effect"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { getMapBySlug } from "@/data/maps"
import { getFontData } from "@/data/og-images"
import { DATE_OPTIONS } from "@/utils/constants"

interface IOpenGraphImage {
	params: Promise<{ slug: string }>
}

export const generateImageMetadata = async ({ params }: IOpenGraphImage) => {
	const { slug } = await params
	const map = await getMapBySlug(false, slug)
	if (!map) return null

	return [
		{
			id: map.id,
			contentType: "image/jpeg",
			size: { width: 1200, height: 630 },
			alt: `${map.title} Preview Image`,
		},
	]
}

export default async function OpenGraphImage({ params }: IOpenGraphImage) {
	const { slug } = await params
	const map = await getMapBySlug(false, slug)
	if (!map) return new Response("map not found", { status: 404 })

	const fonts = await Effect.runPromise(getFontData)

	const getDifficultyCSSProps = (): CSSProperties => {
		switch (map.difficulty) {
			case "Easy":
				return {
					color: "hsl(169 83.8% 78.2%)",
					backgroundImage:
						"radial-gradient(circle at top, hsl(176 69.4% 21.8%), hsl(176 60.8% 19%))",
					border: "1px solid hsl(175 83.9% 31.6%)",
				}
			case "Medium":
				return {
					color: "hsl(53 98.3% 76.9%)",
					backgroundImage: "radial-gradient(circle at top, hsl(32 81% 28.8%), hsl(28 72.5% 25.7%))",
					border: "1px solid hsl(41 96.1% 40.4%)",
				}
			case "Hard":
				return {
					color: "hsl(0 96.3% 89.4%)",
					backgroundImage: "radial-gradient(circle at top, hsl(0 70% 35.3%), hsl(0 62.8% 30.6%))",
					border: "1px solid hsl(0 72.2% 50.6%)",
				}
			default:
				return {}
		}
	}

	const image = await new ImageResponse(
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
				src={`https:${map.image.url}?w=1200&h=630&q=75&fm=jpg`}
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
					{map.game.title}
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
					{map.difficulty}
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
				<span>{new Date(map.updatedAt).toLocaleDateString("en-US", DATE_OPTIONS)}</span>
				<span>&bull;</span>
				<span>{map.timeToRead} min read</span>
			</div>
		</div>,
		{
			fonts: fonts
				? [
						{
							name: "Geist-SemiBold",
							data: fonts.geistSemiBold,
							style: "normal",
							weight: 600,
						},
						{
							name: "Geist-Bold",
							data: fonts.geistBold,
							style: "normal",
							weight: 700,
						},
					]
				: undefined,
		},
	).arrayBuffer()

	const optimizedImage = await sharp(image).jpeg({ quality: 75 }).toBuffer()
	return new Response(optimizedImage.buffer, {
		status: 200,
		headers: {
			"Content-Type": "image/jpeg",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	})
}
