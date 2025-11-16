"use client"
import type { ImageProps } from "@/types/images"
import Image from "next/image"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import ImageLoader from "../loaders/image-loader"

interface FeaturedImageProps extends ImageProps {
	description?: string
}

export default function FeaturedImage({
	featuredImage,
	description,
	alt = "",
	quality = 75,
	className,
	priority,
	sizes,
	width,
	height,
}: FeaturedImageProps) {
	const { imageLoaded, imageErrored, setImageLoaded, setImageErrored } = useImageState()

	if (!featuredImage) return null

	return (
		<figure className="relative m-0 flex h-auto w-full flex-col items-center justify-center">
			{!imageLoaded && !imageErrored ? <ImageLoader className="border" /> : null}
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
					className={cn(
						"flex aspect-auto h-auto w-auto items-center justify-center opacity-0",
						className,
						{
							"animate-fade-in opacity-100": imageLoaded,
						},
					)}
					priority={priority}
					placeholder={!featuredImage ? "blur" : undefined}
				/>
			) : null}
			{/* If both image optimization fails, serve static non-optimized fallback */}
			{imageErrored ? (
				<Image
					unoptimized
					src={placeholderImage}
					alt=""
					placeholder="blur"
					priority={priority}
					className={cn("flex aspect-video h-auto w-full items-center justify-center", className)}
				/>
			) : null}
			{description ? (
				<figcaption className="mt-2 mb-4 flex w-auto items-center justify-center px-4 font-medium italic xl:px-8">
					{description}
				</figcaption>
			) : null}
		</figure>
	)
}
