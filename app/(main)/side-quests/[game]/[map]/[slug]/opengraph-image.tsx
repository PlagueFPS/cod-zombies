import { getFontData } from "@/data/og-images"
import { getQuestBySlug } from "@/data/sideQuests"
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
    console.error(`[${boldFont.error._tag}]`, boldFont.error)
    return null
  }

  if (semiBoldFont.isErr()) {
    console.error(`[${semiBoldFont.error._tag}]`, semiBoldFont.error)
    return null
  }

  return new ImageResponse(
    <div tw="bg-gray-800" style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
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
      <div tw="absolute inset-0" style={{
        backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6), transparent)",
      }} />
      <div tw="absolute bottom-50 left-16 flex items-center justify-center"
        style={{
          gap: "1rem",
        }}
      >
        <span 
          tw="rounded-full font-semibold text-orange-200 border border-orange-500 px-2.5 py-0.5 text-base"
          style={{
            backgroundImage: "linear-gradient(to right, hsl(13 81.1% 14.5%), hsl(15 79.1% 33.7%), hsl(13 81.1% 14.5%))",
          }}
        >
          { q.game.title }
        </span>
        <span 
          tw="rounded-full font-semibold text-orange-200 border border-orange-500 px-2.5 py-0.5 text-base"
          style={{
            backgroundImage: "linear-gradient(to right, hsl(13 81.1% 14.5%), hsl(15 79.1% 33.7%), hsl(13 81.1% 14.5%))",
          }}
        >
          { q.map.title }
        </span>
      </div>
      <h1 tw="bottom-20 left-16 font-bold text-7xl tracking-tight" style={{
        position: "absolute",
        textAlign: "center",
        color: "white",
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
      <div tw="absolute bottom-18 left-16 flex items-center justify-center font-semibold text-xl"
        style={{
          gap: "0.5rem",
          color: "hsl(24 5.4% 63.9%)",
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