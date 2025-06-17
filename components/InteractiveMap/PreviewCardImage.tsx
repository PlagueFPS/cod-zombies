"use client"
import { useImageState } from '@/hooks/useImageState'
import type { MapId } from '@/map-configs'
import Image from 'next/image'
import ImageLoader from '../Loaders/ImageLoader'
import { cn } from '@/lib/utils'

interface IPreviewCardImage {
  mapId: MapId
  title: string
  priority?: boolean
}

export default function PreviewCardImage({ mapId, title, priority }: IPreviewCardImage) {
  const { imageLoaded, setImageLoaded, imageErrored, setImageErrored } = useImageState()

  return (
    <figure className="relative m-0 flex flex-col justify-center items-center w-full h-full">
      { (!imageLoaded && !imageErrored) ? <ImageLoader className="border" /> : null }
      { !imageErrored ? 
        <Image
          unoptimized
          src={`/previews/${mapId}-preview.webp`}
          width={ 640 }
          height={ 360 }
          alt={ `${title} Preview Image` }
          priority={ priority }
          onLoad={ () => setImageLoaded(true) }
          onError={ () => setImageErrored(true) }
          className={cn("h-full w-full object-cover group-hover:scale-105 transition-all duration-300 opacity-0", {
            "animate-fade-in opacity-100": imageLoaded
          })}
        /> : null }
    </figure>
  )
}
