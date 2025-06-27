import { getFontData } from "@/data/og-images"
import { getQuestBySlug } from "@/data/side-quests"
import { DATE_OPTIONS } from "@/utils/constants"
import { ImageResponse } from "next/og"

export const alt = "Side Quest Preview Image"
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

interface IOpenGraphImage {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: IOpenGraphImage) {
  const { slug } = await params
  const q = await getQuestBySlug(false, slug)
  if (!q) return null
 const [boldFont, semiBoldFont] = await Promise.all([
  getFontData("Geist-Bold.otf"),
  getFontData("Geist-SemiBold.otf"),
 ])

  if (boldFont.isErr()) {
    console.error(boldFont.error)
    return null
  }

  if (semiBoldFont.isErr()) {
    console.error(semiBoldFont.error)
    return null
  }

  return new ImageResponse(
    <div style={{
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
        src={`https:${q.image.url}?w=${size.width}&h=${size.height}&q=75&fm=jpg`}
        alt={q.title}
        width={size.width}
        height={size.height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 1,
        }}
      />
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)",
      }} />
      <div style={{
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
            backgroundImage: "radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
          }}
        >
          { q.game.title }
        </span>
        <span 
          style={{
            padding: "0.25rem 0.625rem",
            border: "1px solid hsl(25 95% 53.1%)",
            borderRadius: "9999px",
            color: "hsl(32 97.7% 83.1%)",
            fontWeight: "600",
            fontSize: "1rem",
            backgroundImage: "radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
          }}
        >
          { q.map.title }
        </span>
      </div>
      <h1 style={{
        position: "absolute",
        bottom: "5rem",
        left: "4rem",
        textAlign: "center",
        color: "white",
        fontSize: "4.5rem",
        letterSpacing: "-0.025em",
        fontWeight: "700",
      }}>
        <span style={{
          paddingBottom: "1rem",
          color: "transparent",
          backgroundClip: "text",
          backgroundImage: "linear-gradient(to bottom, hsl(0 0% 100%), hsl(0, 0%, 40%))",
        }}>
          {q.title}
        </span>
      </h1>
      <div style={{
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
        <span>{ new Date(q.updatedAt).toLocaleDateString("en-US", DATE_OPTIONS) }</span>
        <span>&bull;</span>
        <span>{ q.timeToRead } min read</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: boldFont.value,
          style: "normal",
          weight: 700,
        },
        {
          name: "Geist",
          data: semiBoldFont.value,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}