import type { ImagePaths } from "@/types/generated/image-paths.gen"
import type { ReactNode } from "react"
import { Predicate } from "effect"
import { ImageIcon } from "lucide-react"
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

export interface RichImageBaseProps {
	/** The image to display */
	image: ImagePaths
	/** The alt text to provide */
	alt?: string
}

export type RichImageProps =
	| (RichImageBaseProps & {
			/** The caption to display for block-level images */
			caption: string
			children?: never
	  })
	| (RichImageBaseProps & {
			caption?: never
			/** Inline trigger content; renders clickable inline text instead of a block-level image */
			children: ReactNode
	  })

export default function RichImage({ image, caption, alt, children }: RichImageProps) {
	const imageProps: Pick<FeaturedImageProps, "featuredImage" | "sizes"> = {
		featuredImage: image,
		sizes: "(max-width: 828px) 100vw, 1200px",
	}

	const expandedSources: FeaturedImageProps["sources"] = [
		...(Predicate.isNotNullish(getImageVariants(image)?.widths.includes(1200)) &&
		Predicate.isTruthy(getImageVariants(image)?.widths.includes(1200))
			? [{ media: "(max-width: 1200px)", srcSet: variantWebPath(image, 1200) }]
			: []),
		{ srcSet: image },
	]

	const isInline = Predicate.isNotNullish(children)

	const dialogLabel = caption ?? alt ?? (Predicate.isString(children) ? children : "Preview Image")

	const dialog = (
		<Dialog>
			{isInline ? (
				<DialogTrigger className="group inline cursor-pointer text-left text-blue-700 focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:text-blue-300">
					<ImageIcon aria-hidden="true" className="mr-1 inline-block size-4 align-[-0.16em]" />
					<span className="underline decoration-blue-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:decoration-blue-300">
						{children}
					</span>
				</DialogTrigger>
			) : (
				<DialogTrigger className="pointer-events-none relative z-20 w-full sm:pointer-events-auto">
					<FeaturedImage
						{...imageProps}
						width={776}
						height={436}
						description={caption ?? undefined}
						alt={alt ?? caption ?? ""}
						className="cursor-default rounded-lg sm:cursor-zoom-in"
					/>
				</DialogTrigger>
			)}
			<DialogContent
				className="border-none bg-transparent p-0 sm:max-w-[calc(80%)]"
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">{dialogLabel}</DialogTitle>
				<DialogDescription className="sr-only">{dialogLabel}</DialogDescription>
				<DialogClose>
					<FeaturedImage
						{...imageProps}
						width={1920}
						height={1080}
						alt={alt ?? (Predicate.isString(children) ? children : "")}
						sources={expandedSources}
						className="cursor-zoom-out rounded-lg"
					/>
				</DialogClose>
			</DialogContent>
		</Dialog>
	)

	if (isInline) return dialog

	return <div className="relative mt-8 w-full">{dialog}</div>
}
