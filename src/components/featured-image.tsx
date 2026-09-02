"use client"
import type { ImagePaths } from "@/types/generated/image-paths.gen"
import { cn } from "cn"
import { Image, type ImageProps } from "@/components/image"
import ImageLoader from "@/components/image-loader"
import { useImageState } from "@/hooks/use-image-state"

export interface FeaturedImageProps extends Omit<ImageProps, "src"> {
	/** The featured image source url */
	featuredImage: ImagePaths
	/** Optional description to display as a caption below the image */
	description?: string
	/** Classes to apply to the figure element containing the image */
	containerClassName?: string
}

export function FeaturedImage({
	featuredImage,
	description,
	className,
	containerClassName,
	loading = "lazy",
	...rest
}: FeaturedImageProps) {
	const { imageLoaded, imageErrored, setImageLoaded, setImageErrored } = useImageState()
	/** Eager images are LCP candidates — avoid opacity-0 / fade which delay paint. */
	const isLcpCandidate = loading === "eager"

	return (
		<figure
			className={cn(
				"relative m-0 flex h-full w-full flex-col items-center justify-center",
				containerClassName,
			)}
		>
			{!isLcpCandidate && !imageLoaded && !imageErrored ? <ImageLoader className="border" /> : null}
			{!imageErrored ? (
				<Image
					{...rest}
					loading={loading}
					src={featuredImage}
					onLoad={() => setImageLoaded(true)}
					onError={() => setImageErrored(true)}
					className={cn(
						"flex aspect-video h-full w-full items-center justify-center",
						className,
						isLcpCandidate
							? "opacity-100"
							: {
									"opacity-0": !imageLoaded,
									"animate-fade-in opacity-100": imageLoaded,
								},
					)}
				/>
			) : null}
			{/* If both image optimization fails, serve static non-optimized fallback */}
			{imageErrored ? (
				<Image
					{...rest}
					unoptimized
					src="/article-img-placeholder.jpg"
					alt=""
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
