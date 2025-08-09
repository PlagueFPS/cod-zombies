import type { Asset } from "contentful"
import type { ImageProps } from "@/types/images"
import FeaturedImage from "@/components/featured-image/featured-image"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { createImageDto } from "@/utils/contentful-utils"

interface RichImageProps {
	asset: Asset<undefined, string>
}

export default function RichImage({ asset }: RichImageProps) {
	const imageProps: ImageProps = {
		featuredImage: createImageDto(asset),
		sizes: "(max-width: 828px) calc(100vw - 16px), 776px",
	}

	return (
		<div className="relative mt-8 w-full">
			<div className="absolute top-4 right-0 left-0 z-10 mx-auto w-full opacity-35 blur-2xl">
				<FeaturedImage
					{...imageProps}
					quality={100}
					description={asset.fields.description}
					className="rounded-lg"
				/>
			</div>
			<Dialog>
				<DialogTrigger className="pointer-events-none relative z-20 w-full sm:pointer-events-auto">
					<FeaturedImage
						{...imageProps}
						quality={100}
						description={asset.fields.description}
						alt={asset.fields.description}
						className="cursor-default rounded-lg sm:cursor-zoom-in"
					/>
				</DialogTrigger>
				<DialogContent
					className="border-none bg-transparent sm:max-w-[calc(80%)]"
					closeButton={false}
				>
					<DialogTitle className="sr-only">
						{asset.fields.description || "Preview Image"}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{asset.fields.description || "Preview Image"}
					</DialogDescription>
					<FeaturedImage
						{...imageProps}
						quality={100}
						alt={asset.fields.description}
						sizes="(max-width: 1920px) calc(100vw - 16px), 1920px"
						className="rounded-lg"
					/>
				</DialogContent>
			</Dialog>
		</div>
	)
}
