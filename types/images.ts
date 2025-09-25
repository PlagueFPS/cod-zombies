import type { StaticImageData } from "next/image"

export interface ImageProps {
	featuredImage: string | StaticImageData | null
	alt?: string
	quality?: number
	className?: string
	priority?: boolean
	sizes?: string
	width?: number
	height?: number
}
