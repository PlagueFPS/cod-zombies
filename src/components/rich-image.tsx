import type { ImagePaths } from "@/types/generated/image-paths.gen"
import { FeaturedImage, type FeaturedImageProps } from "@/components/featured-image"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { getImageVariants } from "@/lib/generate-img-attrs"
import { variantWebPath } from "@/lib/image-variant-paths"

export interface RichImageProps {
	/** The image to display */
	image: ImagePaths
	/** The caption to display */
	caption: string
	/** The alt text to provide */
	alt?: string
}

export default function RichImage({ image, caption, alt }: RichImageProps) {
	const imageProps: Pick<FeaturedImageProps, "featuredImage" | "sizes"> = {
		featuredImage: image,
		sizes: "(max-width: 828px) 100vw, 1200px",
	}

	const expandedSources: FeaturedImageProps["sources"] = [
		...(getImageVariants(image)?.widths.includes(1200)
			? [{ media: "(max-width: 1200px)", srcSet: variantWebPath(image, 1200) }]
			: []),
		{ srcSet: image },
	]

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
							sources={expandedSources}
							className="cursor-zoom-out rounded-lg"
						/>
					</DialogClose>
				</DialogContent>
			</Dialog>
		</div>
	)
}
