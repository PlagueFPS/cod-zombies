import type { Asset } from "contentful"
import type { ImageProps } from "@/types/images"
import FeaturedImage from "@/components/featured-image/featured-image"
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
				<FeaturedImage {...imageProps} quality={100} description={asset.fields.description} className="rounded-lg" />
			</div>
			<div className="relative z-20">
				<FeaturedImage {...imageProps} quality={100} description={asset.fields.description} className="rounded-lg" />
			</div>
		</div>
	)
}
