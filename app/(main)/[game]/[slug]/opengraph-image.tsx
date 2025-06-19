import { getMapBySlug } from "@/data/maps"
import { getFontData } from "@/data/og-images"
import { DATE_OPTIONS } from "@/utils/constants"
import { ImageResponse } from "next/og"
import type { CSSProperties } from "react"

export const alt = "Main Quest Preview Image"
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
  const map = await getMapBySlug(false, slug)
  if (!map) return null
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

  const getDifficultyCSSProps = (): CSSProperties => {
    switch(map.difficulty) {
      case "Easy":
        return {
          color: "hsl(169 83.8% 78.2%)",
          backgroundImage: "radial-gradient(circle at top, hsl(176 69.4% 21.8%), hsl(176 60.8% 19%))",
          borderColor: "hsl(175 83.9% 31.6%)"
        }
      case "Medium":
        return {
          color: "hsl(53 98.3% 76.9%)",
          backgroundImage: "radial-gradient(circle at top, hsl(32 81% 28.8%), hsl(28 72.5% 25.7%))",
          borderColor: "hsl(41 96.1% 40.4%)"
        }
      case "Hard":
        return {
          color: "hsl(0 96.3% 89.4%)",
          backgroundImage: "radial-gradient(circle at top, hsl(0 70% 35.3%), hsl(0 62.8% 30.6%))",
          borderColor: "hsl(0 72.2% 50.6%)"
          
        }
      default:
        return {}
    }
  }

  return new ImageResponse(
    <div tw="bg-black" style={{
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
        src={`https:${map.image.url}?w=${size.width}&h=${size.height}&q=75&fm=jpg`}
        alt={map.title}
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
        backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)",
      }} />
      <div tw="absolute bottom-50 left-16 flex items-center justify-center"
        style={{
          gap: "1rem",
        }}
      >
        <span 
          tw="rounded-full font-semibold text-orange-200 border border-orange-500 px-2.5 py-0.5 text-base"
          style={{
            backgroundImage: "radial-gradient(circle at top, hsl(15 79.1% 33.7%), hsl(15 74.6% 27.8%))",
          }}
        >
          { map.game.title }
        </span>
        <span 
          tw="rounded-full font-semibold border px-2.5 py-0.5 text-base"
          style={ getDifficultyCSSProps() }
        >
          { map.difficulty }
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
          { map.title }
        </span>
      </h1>
      <div tw="absolute bottom-20 left-16 flex items-center justify-center font-semibold text-xl"
        style={{
          gap: "0.5rem",
          color: "hsl(24 5.4% 63.9%)",
        }}
      >
        <span>{ new Date(map.updatedAt).toLocaleDateString("en-US", DATE_OPTIONS) }</span>
        <span>&bull;</span>
        <span>{ map.timeToRead } min read</span>
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