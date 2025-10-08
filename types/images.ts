import type { StaticImageData } from "next/image"
import type { ImagePath } from "./image-paths"

export interface ImageProps {
	featuredImage: ImagePath | StaticImageData | null
	alt?: string
	quality?: number
	className?: string
	priority?: boolean
	sizes?: string
	width?: number
	height?: number
}
