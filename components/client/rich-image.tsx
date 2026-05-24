import type { ImagePaths } from "@/types/generated/image-paths.gen"
import type { ImageProps } from "@/types/images"
import { FeaturedImage } from "@/components/client/featured-image"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

interface RichImageProps {
	/** The image to display */
	image: ImagePaths
	/** The caption to display */
	caption: string
	/** The alt text to provide */
	alt?: string
}

const richImageInlineProps = (image: ImagePaths): ImageProps => ({
	featuredImage: image,
	sizes: "(max-width: 828px) 100vw, 1200px",
})

const richImageLightboxSizes = "(max-width: 1920px) 100vw, 1920px"

export default function RichImage({ image, caption, alt }: RichImageProps) {
	const imageProps = richImageInlineProps(image)

	return (
		<div className="relative mt-8 w-full">
			<Dialog>
				<DialogTrigger className="pointer-events-none relative z-20 w-full sm:pointer-events-auto">
					<FeaturedImage
						{...imageProps}
						width={776}
						height={436}
						description={caption ?? undefined}
						alt={alt ?? caption}
						className="cursor-default rounded-lg sm:cursor-zoom-in"
					/>
				</DialogTrigger>
				<DialogContent
					className="border-none bg-transparent p-0 sm:max-w-[calc(80%)]"
					showCloseButton={false}
				>
					<DialogTitle className="sr-only">{caption ?? "Preview Image"}</DialogTitle>
					<DialogDescription className="sr-only">{caption ?? "Preview Image"}</DialogDescription>
					<DialogClose>
						<FeaturedImage
							{...imageProps}
							width={1920}
							height={1080}
							alt={alt ?? ""}
							sizes={richImageLightboxSizes}
							className="cursor-zoom-out rounded-lg"
						/>
					</DialogClose>
				</DialogContent>
			</Dialog>
		</div>
	)
}
