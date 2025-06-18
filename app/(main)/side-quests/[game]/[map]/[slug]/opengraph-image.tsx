import { getQuestBySlug } from "@/data/sideQuests"
import { SideQuest } from "@/types/SideQuest"
import { readFile } from "fs/promises"
import { ImageResponse } from "next/og"
import { join } from "path"
import { DATE_OPTIONS } from "@/utils/constants"
// import { env } from "@/env"

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
  const font = await readFile(join(process.cwd(), "fonts/Geist-ExtraBold.ttf"))
  return new ImageResponse(
    <OGImage q={ q } />,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: font,
          style: "normal",
          weight: 800,
        },
      ],
    }
  )
  // return new ImageResponse(
  //   <div tw="relative flex flex-col items-center justify-center h-full w-full bg-black rounded-lg">
  //     {/* <img 
  //       src={`https:${q.image.url}?w=${size.width}&h=${size.height}&q=75&fm=jpg`}
  //       alt={q.title}
  //       width={size.width}
  //       height={size.height}
  //       style={{
  //         width: '100%',
  //         height: '100%',
  //         objectFit: 'cover',
  //         opacity: 0.5,
  //       }}
  //     /> */}
  //     <h1 tw="absolute top-48 m-auto text-center text-8xl font-extrabold tracking-tight">
  //       <span tw="pb-4 text-transparent shadow-lg shadow-black" style={{
  //         backgroundClip: "text",
  //         backgroundImage: "linear-gradient(to bottom, hsl(0 0% 100%), hsl(0, 0%, 40%))",
  //       }}>
  //         {q.title}
  //       </span>
  //     </h1>
  //   </div>,
  //   {
  //     ...size,
  //     fonts: [
  //       {
  //         name: "Geist",
  //         data: font,
  //         style: "normal",
  //         weight: 800,
  //       },
  //     ],
  //   }
  // )
}


function OGImage({ q }: { q: SideQuest & { timeToRead: number } }) {
  return (
    <>
      {/* OG Image Container - Standard 1200x630 dimensions */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'hsl(0, 0%, 0%)',
        borderRadius: '0.5rem',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)'
      }}>
        {/* Background Image */}
        {/* <img
          src={`https:${q.image.url}?w=${size.width}&h=${size.height}&q=75&fm=jpg`}
          alt={`${q.title} - Side Quest Preview Image`}
          width={1200}
          height={630}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        /> */}

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: "column",
          inset: 0,
          backgroundImage: 'linear-gradient(to top, hsl(0, 0%, 0%), hsl(0, 0%, 25%))'
        }} />

        {/* Content Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem'
        }}>
          {/* Top Section - Blog/Site Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {/* <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: 'hsl(0, 0%, 100%)',
                borderRadius: '50%'
              }}>
                <img 
                  src={ `${env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp` }
                  alt="Site Logo"
                  width={ 64 }
                  height={ 64 }
                />
              </div> */}
              <span style={{
                color: 'hsl(0, 0%, 90%)',
                fontSize: '1.25rem',
                fontWeight: 500
              }}>COD: Zombies Guides</span>
            </div>
            <div style={{
              display: "flex",
              color: 'hsl(0, 0%, 70%)',
              fontSize: '1rem',
              fontWeight: 500
            }}>{ q.timeToRead } min read</div>
          </div>

          {/* Bottom Section - Main Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Category Tag */}
            <div style={{
              display: 'flex',
              gap: '0.25rem'
            }}>
              <span style={{
                backgroundColor: 'hsl(24, 100%, 50%)',
                color: 'hsl(0, 0%, 100%)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>{ q.game.title }</span>
              <span style={{
                backgroundColor: 'hsl(24, 100%, 50%)',
                color: 'hsl(0, 0%, 100%)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>{ q.map.title }</span>
            </div>

            {/* Title */}
            <h1 style={{
              color: 'hsl(0, 0%, 100%)',
              fontSize: '1.75rem',
              fontWeight: 700,
              lineHeight: 1.2
            }}>
              { q.title }
            </h1>

            {/* Author and Date */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <div style={{
                  display: "flex",
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: 'hsl(210, 100%, 50%)',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  color: 'hsl(0, 0%, 90%)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>COD: Zombies Guides</span>
              </div>
              <span style={{
                color: 'hsl(0, 0%, 70%)',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>•</span>
              <span style={{
                color: 'hsl(0, 0%, 70%)',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>{ new Date(q.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}