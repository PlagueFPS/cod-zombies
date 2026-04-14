import type { ImagePaths } from "@/types/generated/image-paths.gen"
import { Image, type ImageProps } from "@/components/image"
import { useImageState } from "@/hooks/use-image-state"
import { cn } from "@/lib/utils"

interface IconImageProps extends Omit<ImageProps, "src"> {
	featuredImage: ImagePaths
	withLoader?: boolean
}

export default function IconImage({
	featuredImage,
	className,
	withLoader = false,
	...rest
}: IconImageProps) {
	const { imageLoaded, imageErrored, setImageLoaded, setImageErrored } = useImageState()

	return (
		<>
			{withLoader && !imageLoaded ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="size-8 animate-spin rounded-full border-[3px] border-border border-r-transparent" />
				</div>
			) : null}
			{!imageErrored ? (
				<Image
					{...rest}
					src={featuredImage}
					onLoad={() => setImageLoaded(true)}
					onError={() => setImageErrored(true)}
					className={cn("flex h-auto w-full items-center justify-center", className)}
				/>
			) : null}
		</>
	)
}
