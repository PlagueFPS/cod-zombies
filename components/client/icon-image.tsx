"use client"
import type { ImageProps } from "@/types/images"
import Image from "next/image"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"

interface IconImageProps extends ImageProps {
	withLoader?: boolean
}

export default function IconImage({
	featuredImage,
	alt = "",
	quality = 75,
	className,
	priority,
	sizes,
	withLoader = false,
	width,
	height,
}: IconImageProps) {
	const { imageLoaded, imageErrored, setImageLoaded, setImageErrored } = useImageState()

	if (!featuredImage) return null

	return (
		<>
			{withLoader && !imageLoaded ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="size-8 animate-spin rounded-full border-[3px] border-border border-r-transparent" />
				</div>
			) : null}
			{!imageErrored ? (
				<Image
					src={featuredImage}
					alt={alt}
					width={width}
					height={height}
					sizes={sizes}
					onLoad={() => setImageLoaded(true)}
					onError={() => setImageErrored(true)}
					quality={quality}
					className={cn("flex h-auto w-full items-center justify-center opacity-0", className, {
						"animate-fade-in opacity-100": imageLoaded,
					})}
					priority={priority}
				/>
			) : null}
		</>
	)
}
