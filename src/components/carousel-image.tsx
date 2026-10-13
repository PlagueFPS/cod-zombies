import type { RichImageProps } from "@/components/rich-image"
import { FeaturedImage } from "@/components/featured-image"
import { DialogTrigger } from "@/components/ui/dialog"
import { useCarousel } from "@/contexts/carousel-provider"

export function CarouselImage({ image, caption, alt, index }: RichImageProps & { index: number }) {
	const { expand } = useCarousel()

	return (
		<div className="relative mt-8 w-full">
			<DialogTrigger className="relative z-20 w-full" onClick={() => expand(index)}>
				<FeaturedImage
					featuredImage={image}
					width={776}
					height={436}
					description={caption}
					alt={alt ?? caption}
					sizes="(max-width: 828px) 100vw, 1200px"
					className="cursor-zoom-in rounded-lg"
				/>
			</DialogTrigger>
		</div>
	)
}

export function ExpandedCarouselImage({ image, caption, alt }: RichImageProps) {
	return (
		<FeaturedImage
			featuredImage={image}
			width={1920}
			height={1080}
			description={caption}
			alt={alt ?? caption}
			sizes="(max-width: 1920px) 100vw, 1920px"
			containerClassName="rounded-lg bg-background text-foreground shadow-lg [&>figcaption]:m-0 [&>figcaption]:w-full [&>figcaption]:px-4 [&>figcaption]:py-3 [&>figcaption]:text-center [&>figcaption]:text-base [&>figcaption]:leading-relaxed"
			className="aspect-auto h-auto max-h-[calc(100dvh-12rem)] rounded-lg object-contain"
		/>
	)
}
