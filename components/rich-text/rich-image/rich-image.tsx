import type { StaticImageData } from "next/image"
import type { ContentImagePath, ZombiesImagePath } from "@/types/image-paths"
import type { ImageProps } from "@/types/images"
import FeaturedImage from "@/components/featured-image/featured-image"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

interface RichImageProps {
	image: StaticImageData | ContentImagePath | ZombiesImagePath
	caption: string
	alt?: string
}

export default function RichImage({ image, caption, alt }: RichImageProps) {
	const imageProps: ImageProps = {
		featuredImage: image,
		sizes: "(max-width: 828px) calc(100vw - 16px), 776px",
	}

	return (
		<div className="relative mt-8 w-full">
			<div className="absolute top-4 right-0 left-0 z-10 mx-auto w-full opacity-35 blur-2xl">
				<FeaturedImage
					{...imageProps}
					quality={100}
					width={776}
					height={436}
					description={caption ?? undefined}
					className="rounded-lg"
				/>
			</div>
			<Dialog>
				<DialogTrigger className="pointer-events-none relative z-20 w-full sm:pointer-events-auto">
					<FeaturedImage
						{...imageProps}
						width={776}
						height={436}
						quality={100}
						description={caption ?? undefined}
						alt={alt ?? ""}
						className="cursor-default rounded-lg sm:cursor-zoom-in"
					/>
				</DialogTrigger>
				<DialogContent
					className="border-none bg-transparent sm:max-w-[calc(80%)]"
					closeButton={false}
				>
					<DialogTitle className="sr-only">{caption ?? "Preview Image"}</DialogTitle>
					<DialogDescription className="sr-only">{caption ?? "Preview Image"}</DialogDescription>
					<DialogClose>
						<FeaturedImage
							{...imageProps}
							quality={100}
							alt={alt ?? ""}
							sizes="(max-width: 1920px) calc(100vw - 16px), 1920px"
							className="cursor-zoom-out rounded-lg"
						/>
					</DialogClose>
				</DialogContent>
			</Dialog>
		</div>
	)
}
