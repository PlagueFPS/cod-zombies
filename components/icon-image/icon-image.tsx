"use client"
import type { ImageProps } from "@/types/images"
import Image from "next/image"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"
import { customImageLoader } from "@/utils/image-loader"

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
}: IconImageProps) {
	const {
		imageLoaded,
		imageErrored,
		fallbackLoaded,
		fallbackErrored,
		setImageLoaded,
		setImageErrored,
		setFallbackLoaded,
		setFallbackErrored,
	} = useImageState()
	const featuredImageURL = featuredImage?.url ? featuredImage.url : null

	if (!featuredImageURL) return null

	return (
		<>
			{withLoader && !imageLoaded ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="size-8 animate-spin rounded-full border-[3px] border-border border-r-transparent" />
				</div>
			) : null}
			{!imageErrored ? (
				<Image
					src={featuredImageURL}
					alt={alt}
					width={featuredImage?.width ?? undefined}
					height={featuredImage?.height ?? undefined}
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
			{imageErrored && !fallbackErrored ? (
				<Image
					src={featuredImageURL}
					loader={({ src, width, quality }) => customImageLoader({ src, width, quality })}
					alt={alt}
					width={featuredImage?.width ?? undefined}
					height={featuredImage?.height ?? undefined}
					sizes={sizes}
					onLoad={() => setFallbackLoaded(true)}
					onError={() => setFallbackErrored(true)}
					quality={quality}
					className={cn("flex h-auto w-full items-center justify-center opacity-0", className, {
						"animate-fade-in opacity-100": fallbackLoaded,
					})}
					priority={priority}
					placeholder={!featuredImage ? "blur" : undefined}
				/>
			) : null}
		</>
	)
}
