import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Unlock the secrets of Call of Duty: Zombies'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const interExtraBold = fetch(new URL('./Inter-ExtraBold.ttf', import.meta.url)).then((res) => res.arrayBuffer())

  return new ImageResponse((
    <div 
      tw='flex flex-col items-center justify-center h-full tracking-tight w-full bg-black text-[#333] text-8xl'
    >
      <span style={{
        background: 'linear-gradient(180deg, #fff, #adadad)',
        color: 'transparent',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
      }}>
        Unlock the secrets of
      </span>
      <div tw='flex justify-center items-center'>
        <span style={{
          background: 'linear-gradient(180deg, #fff, #adadad)',
          color: 'transparent',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          paddingBottom: '0.5rem',
          marginLeft: '0.5rem'
        }}>
          Call of Duty: 
        </span>
        <span style={{ 
            background: 'linear-gradient(to bottom, #fb923c, #f97316, #ea580c)', 
            color: 'transparent', 
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            marginLeft: '0.5rem',
            paddingBottom: '0.5rem'
          }}
        >
          Zombies
        </span>
      </div>
    </div>
  ), {
    ...size,
    fonts: [
      {
        name: 'Inter',
        data: await interExtraBold,
        style: 'normal',
        weight: 800
      }
    ]
  })
}
