export interface ImageProps {
	featuredImage:
		| {
				url: string | undefined | null
				width: number | undefined | null
				height: number | undefined | null
		  }
		| string
		| null
	alt?: string
	quality?: number
	className?: string
	priority?: boolean
	sizes?: string
	width?: number
	height?: number
}
