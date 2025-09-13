import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { getZombieBySlug } from "@/data/zombies"
import { DATE_OPTIONS } from "@/utils/constants"

export const alt = "Zombie Info Card Preview"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function ZombieImage({ params }: PageProps<"/bestiary/[slug]">) {
  const { slug } = await params
  const [zombie, boldFont, semiBoldFont] = await Promise.all([
    getZombieBySlug(slug),
    readFile(join(process.cwd(), "/assets/Geist-Bold.otf")),
    readFile(join(process.cwd(), "/assets/Geist-SemiBold.otf")),
  ])
  
  if (!zombie?.image.url) {
    console.log("No image URL found for zombie", zombie?.slug)
    return null
  }

  const imageRes = await fetch(zombie.image.url)
  if (!imageRes.ok) {
    console.log("Failed to fetch image for zombie", zombie.slug)
    return null
  }
  // We need to do this optimization because our preview images are stored in optimized formats (.webp/.avif)
  // which is not supported by Satori. We convert them to PNGs to ensure compatibility.
  const rawImageBuffer = await imageRes.arrayBuffer()
  const supportedImageArray = await sharp(rawImageBuffer).png({ quality: 85 }).resize(1200).toBuffer()

  const getTypeCSSProps = (): React.CSSProperties => {
    switch (zombie.type) {
      case "Normal":
				return {
					color: "hsl(169 85% 78%)",
					backgroundImage:
						"radial-gradient(circle at top, hsl(177 100% 19%), hsl(176 76% 18%))",
					border: "1px solid hsl(175 100% 29%)",
				}
      case "Special":
				return {
					color: "hsl(53 99% 76%)",
					backgroundImage: "radial-gradient(circle at top, hsl(33 100% 27%), hsl(30 83% 25%))",
					border: "1px solid hsl(39 100% 41%)",
				}
      case "Elite":
        return {
          color: "hsl(353 100% 90%)",
          backgroundImage: "radial-gradient(circle at top, hsl(340 100% 32%), hsl(359 69% 30%))",
          border: "1px solid hsl(357 100% 45%)",
        }
      case "Boss":
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
        src={supportedImageArray.buffer}
        alt={zombie.title}
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
            backgroundImage:
              "radial-gradient(circle at top, hsl(17 100% 31%), hsl(16 83% 27%))",
          }}
        >
          {zombie.maps[0]?.title}
        </span>
        <span
          style={{
            ...getTypeCSSProps(),
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
        <span>{new Date(zombie.updatedAt).toLocaleDateString("en-US", DATE_OPTIONS)}</span>
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

  const buffer = await res.arrayBuffer()
  const optimizedBuffer = await sharp(buffer).png({ quality: 75 }).toBuffer()

  return new Response(optimizedBuffer, {
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
  })
}
