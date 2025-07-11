"use client"
import type { MapId } from "@/map-configs"
import Image from "next/image"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"
import ImageLoader from "../loaders/image-loader"

interface IPreviewCardImage {
	mapId: MapId
	title: string
	priority?: boolean
	className?: string
}

export default function PreviewCardImage({ mapId, title, priority, className }: IPreviewCardImage) {
	const { imageLoaded, setImageLoaded, imageErrored, setImageErrored } = useImageState()

	return (
		<figure className="relative m-0 flex h-full w-full flex-col items-center justify-center">
			{!imageLoaded && !imageErrored ? <ImageLoader className="border" /> : null}
			{!imageErrored ? (
				<Image
					unoptimized
					src={`/previews/${mapId}-preview.webp`}
					width={640}
					height={360}
					alt={`${title} Preview Image`}
					priority={priority}
					onLoad={() => setImageLoaded(true)}
					onError={() => setImageErrored(true)}
					className={cn("h-full w-full object-cover opacity-0 group-hover:scale-105", className, {
						"animate-fade-in opacity-100": imageLoaded,
					})}
				/>
			) : null}
		</figure>
	)
}
