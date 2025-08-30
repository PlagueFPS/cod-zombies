"use client"
import type { ImageProps } from "@/types/images"
import Image from "next/image"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"
import placeholderImage from "@/public/article-img-placeholder.jpg"
import { customImageLoader } from "@/utils/image-loader"
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
}: FeaturedImageProps) {
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
	const featuredImageURL = featuredImage?.url ? featuredImage.url : placeholderImage

	return (
		<figure className="relative m-0 flex h-auto w-full flex-col items-center justify-center">
			{!imageLoaded && !fallbackLoaded ? <ImageLoader className="border" /> : null}
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
					className={cn(
						"flex aspect-video h-auto w-full items-center justify-center opacity-0",
						className,
						{
							"animate-fade-in opacity-100": imageLoaded,
						},
					)}
					priority={priority}
					placeholder={!featuredImage ? "blur" : undefined}
				/>
			) : null}
			{/* If the image optimization fails, we fall back to contentful's image optimization */}
			{/* {imageErrored && !fallbackErrored ? (
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
					className={cn(
						"flex aspect-video h-auto w-full items-center justify-center opacity-0",
						className,
						{
							"animate-fade-in opacity-100": fallbackLoaded,
						},
					)}
					priority={priority}
					placeholder={!featuredImage ? "blur" : undefined}
				/>
			) : null} */}
			{/* If both image optimization fails, serve static non-optimized fallback */}
			{fallbackErrored ? (
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
