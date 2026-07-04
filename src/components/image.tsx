"use client"
import {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	type ImgHTMLAttributes,
	type ReactEventHandler,
	type RefObject,
	type SyntheticEvent,
} from "react"
import ReactDOM from "react-dom"
import { useMergeRef } from "@/hooks/use-merge-ref"
import { buildVariantUrl } from "@/scripts/image-optimization-utils"
import { VARIANT_WIDTHS } from "@/types/generated/image-variants.gen"

export interface ImageProps extends Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"onLoad" | "onError" | "src" | "alt"
> {
	/** The source URL of the image (internal path or external URL)
	 *
	 * @example "/path/to/image.jpg"
	 * @example "https://example.com/image.jpg"
	 */
	src: string
	/**
	 * The alt text used to describe the image for accessibility.
	 *
	 * For decorative images, use an empty string.
	 */
	alt: string
	/** The width of the image */
	width: number
	/** The height of the image  */
	height: number
	/**
	 * Define the sizes of the image at different breakpoints.
	 * Used by the browser to choose the most appropriate size from the generated `srcset`.
	 * If not provided, the browser assumes the image will fill the viewport width (`100vw`).
	 * @default "100vw"
	 */
	sizes?: string
	/** The callback function to call when the image is loaded */
	onLoad?: ReactEventHandler<HTMLImageElement>
	/** The callback function to call when the image fails to load */
	onError?: ReactEventHandler<HTMLImageElement>
	/** The source set of the image */
	srcSet?: string
	/**
	 * An integer between `1` and `100` that sets the quality of the optimized image.
	 * Higher values increase file size and visual fidelity. Lower values reduce
	 * file size but may affect sharpness.
	 * @default 75
	 */
	quality?: number
	/**
	 * Whether to preload the image.
	 * @default false
	 */
	preload?: boolean
	/**
	 * Whether to use the unoptimized source image
	 * @default false
	 */
	unoptimized?: boolean
	/**
	 * Controls when the image should start loading.
	 * @default "lazy"
	 */
	loading?: "lazy" | "eager"
	/**
	 * The hint to the browser indicating if it should wait for the image
	 * to be decoded before presenting other content updates or not.
	 * @default "async"
	 */
	decoding?: "sync" | "async" | "auto"
}

type ImgElementWithDataProp = HTMLImageElement & {
	"data-loaded-src": string | undefined
}

interface GenImgAttrs {
	src: string
	srcSet: string | undefined
	sizes: string | undefined
}

/** Dedupe `onLoad` when both the cached/ref path and the native `load` event run. */
const LOADED_SRC_ATTR = "data-loaded-src"

function getAvailableVariantWidths(src: string): readonly number[] {
	if (src.startsWith("http://") || src.startsWith("https://")) return []
	return VARIANT_WIDTHS[src as keyof typeof VARIANT_WIDTHS] ?? []
}

export function generateImgAttrs(src: string, unoptimized: boolean, sizes?: string): GenImgAttrs {
	if (unoptimized) return { srcSet: undefined, sizes: undefined, src }

	const available = getAvailableVariantWidths(src)
	if (available.length === 0) {
		return { src, srcSet: undefined, sizes }
	}

	const srcSet = available.map(w => `${buildVariantUrl(src, w)} ${w}w`).join(", ")
	const largest = available.at(-1)!

	return {
		sizes,
		srcSet,
		src: buildVariantUrl(src, largest),
	}
}

function createSyntheticLoadEvent(img: HTMLImageElement): SyntheticEvent<HTMLImageElement> {
	const event = new Event("load")
	Object.defineProperty(event, "target", { writable: false, value: img })
	let prevented = false
	let stopped = false
	return {
		// oxlint-disable-next-line no-misused-spread
		...event,
		nativeEvent: event,
		currentTarget: img,
		target: img,
		isDefaultPrevented() {
			return prevented
		},
		isPropagationStopped() {
			return stopped
		},
		preventDefault() {
			prevented = true
			event.preventDefault()
		},
		stopPropagation() {
			stopped = true
			event.stopPropagation()
		},
		persist() {},
	} as unknown as SyntheticEvent<HTMLImageElement>
}

function handleLoading(
	img: ImgElementWithDataProp,
	onLoadRef: RefObject<ReactEventHandler<HTMLImageElement> | undefined>,
) {
	const src = img?.src
	if (!img || img[LOADED_SRC_ATTR] === src) return

	img[LOADED_SRC_ATTR] = src
	const p = "decode" in img ? img.decode() : Promise.resolve()
	void p
		.catch(() => {})
		.then(() => {
			if (!img.parentElement && !img.isConnected) {
				return
			}

			if (onLoadRef.current) {
				const event = createSyntheticLoadEvent(img)
				onLoadRef.current(event)
			}
		})
}

/**
 * The `Image` component used to optimize images.
 *
 * Heavily inspired by the [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image).
 */
export const Image = forwardRef<HTMLImageElement | null, ImageProps>(
	(
		{
			src,
			height,
			width,
			decoding = "async",
			className,
			style,
			quality: _quality,
			sizes,
			preload,
			crossOrigin,
			referrerPolicy,
			fetchPriority,
			unoptimized = false,
			onLoad,
			onError,
			loading = "lazy",
			...props
		},
		forwardedRef,
	) => {
		const onLoadRef = useRef(onLoad)
		const ownRef = useCallback(
			(img: ImgElementWithDataProp | null) => {
				if (!img) return
				if (onError) {
					// oxlint-disable-next-line no-self-assign
					img.src = img.src
				}

				if (process.env.NODE_ENV !== "production") {
					if (!src) {
						console.error(`Image is missing required "src" property:`, img)
					}

					if (img.getAttribute("alt") === null) {
						console.error(
							`Image "${src}" is missing required "alt" property. Please add Alt Text to describe the image for screen readers and search engines.`,
						)
					}
				}

				if (img.complete && img.naturalWidth > 0) {
					handleLoading(img, onLoadRef)
				}
			},
			[src, onLoadRef, onError],
		)

		useEffect(() => {
			onLoadRef.current = onLoad
		}, [onLoad])

		const ref = useMergeRef(forwardedRef, ownRef)
		const imgAttrs = generateImgAttrs(src, unoptimized, sizes)

		if (preload) {
			ReactDOM.preload(imgAttrs.src, {
				as: "image",
				imageSrcSet: imgAttrs.srcSet,
				imageSizes: imgAttrs.sizes,
				crossOrigin,
				referrerPolicy,
				fetchPriority,
			})
		}

		return (
			<img
				{...props}
				loading={loading}
				width={width}
				height={height}
				decoding={decoding}
				className={className}
				style={style}
				sizes={imgAttrs.sizes}
				srcSet={imgAttrs.srcSet}
				src={imgAttrs.src}
				ref={ref}
				onLoad={event => {
					const img = event.currentTarget as ImgElementWithDataProp
					handleLoading(img, onLoadRef)
				}}
				onError={onError}
			/>
		)
	},
)
