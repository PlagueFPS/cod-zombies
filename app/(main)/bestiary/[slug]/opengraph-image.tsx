import type { CSSProperties } from "react"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
// import { getFontData } from "@/data/og-images"
import { getZombieBySlug } from "@/data/zombies"
import { DATE_OPTIONS } from "@/utils/constants"

export const alt = "Zombie Preview Image"
export const size = {
	width: 1200,
	height: 630,
}
export const contentType = "image/png"

interface IOpenGraphImage {
	params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: IOpenGraphImage) {
	const { slug } = await params
	const zombie = await getZombieBySlug(false, slug)
	if (!zombie) return new Response("Zombie not found", { status: 404 })

	const [geistSemiBold, geistBold] = await Promise.all([
		readFile(join(process.cwd(), "assets/Geist-SemiBold.otf")),
		readFile(join(process.cwd(), "assets/Geist-Bold.otf")),
	])

	// const fonts = await getFontData
	// if (!fonts) return new Response("Failed to load font data", { status: 500 })

	const getDifficultyCSSProps = (): CSSProperties => {
		switch (zombie.type) {
			case "Normal":
				return {
					color: "hsl(169 83.8% 78.2%)",
					backgroundImage:
						"radial-gradient(circle at top, hsl(176 69.4% 21.8%), hsl(176 60.8% 19%))",
					border: "1px solid hsl(175 83.9% 31.6%)",
				}
			case "Special":
				return {
					color: "hsl(53 98.3% 76.9%)",
					backgroundImage: "radial-gradient(circle at top, hsl(32 81% 28.8%), hsl(28 72.5% 25.7%))",
					border: "1px solid hsl(41 96.1% 40.4%)",
				}
			case "Elite":
				return {
					color: "hsl(353 96.1% 90%)",
					backgroundImage:
						"radial-gradient(circle at top, hsl(343 79.7% 34.7%), hsl(342 75.5% 30.4%))",
					border: "1px solid hsl(347 77.2% 49.8%)",
				}
			case "Boss":
				return {
					color: "hsl(0 96.3% 89.4%)",
					backgroundImage: "radial-gradient(circle at top, hsl(0 70% 35.3%), hsl(0 62.8% 30.6%))",
					border: "1px solid hsl(0 72.2% 50.6%)",
				}
			default:
				return {}
		}
	}

	return new ImageResponse(
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
			<img
				src={`https:${zombie.image.url}?w=${size.width}&h=${size.height}&q=75&fm=jpg`}
				alt={zombie.name}
				width={size.width}
				height={size.height}
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
					{zombie.games[0] ? zombie.games[0].title : null}
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
					{zombie.name}
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
				<span>{new Date(zombie.updatedAt).toLocaleDateString("en-US", DATE_OPTIONS)}</span>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "Geist",
					data: geistSemiBold,
					style: "normal",
					weight: 700,
				},
				{
					name: "Geist",
					data: geistBold,
					style: "normal",
					weight: 600,
				},
			],
		},
	)
}
