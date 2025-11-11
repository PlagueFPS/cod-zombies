import type { ImagePaths } from "./generated/image-paths.gen"

export interface ImageProps {
	featuredImage: ImagePaths | null
	alt?: string
	quality?: number
	className?: string
	priority?: boolean
	sizes?: string
	width?: number
	height?: number
}
