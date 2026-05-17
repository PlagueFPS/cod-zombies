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
import { env } from "@/env"
import { useMergeRef } from "@/hooks/use-merge-ref"

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

interface Widths {
	kind: "x" | "w"
	widths: readonly number[]
}

interface GenImgAttrs {
	src: string
	srcSet: string | undefined
	sizes: string | undefined
}

/** Dedupe `onLoad` when both the cached/ref path and the native `load` event run. */
const LOADED_SRC_ATTR = "data-loaded-src"
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920] as const
const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 384] as const
const DEFAULT_QUALITY = 75

function getWidths(width: number | undefined, sizes: string | undefined): Widths {
	const allSizes = [...IMAGE_SIZES, ...DEVICE_SIZES]

	if (sizes) {
		// Find all the "vw" percent sizes used in the sizes prop
		const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g
		const percentSizes = []
		for (let match; (match = viewportWidthRe.exec(sizes)); match) {
			if (match[2]) {
				percentSizes.push(parseInt(match[2]))
			}
		}
		if (percentSizes.length) {
			const smallestRatio = Math.min(...percentSizes) * 0.01
			return {
				widths: allSizes.filter(s => s >= DEVICE_SIZES[0] * smallestRatio),
				kind: "w",
			}
		}
		return { widths: allSizes, kind: "w" }
	}
	if (typeof width !== "number") {
		return { widths: DEVICE_SIZES, kind: "w" }
	}

	const widths = [
		...new Set([width, width * 2].map(w => allSizes.find(p => p >= w) || allSizes.at(-1))),
	].filter(w => w !== undefined)

	return { widths, kind: "x" }
}

function generateImgAttrs(
	src: string,
	unoptimized: boolean,
	width?: number,
	quality?: number,
	sizes?: string,
): GenImgAttrs {
	if (unoptimized) return { srcSet: undefined, sizes: undefined, src }

	const { widths, kind } = getWidths(width, sizes)
	// We know the last width is always defined
	const last = widths.at(-1)!

	const srcSet = widths
		.map((w, i) => `${buildOptimizedUrl(src, w, quality)} ${kind === "w" ? w : i + 1}${kind}`)
		.join(", ")

	return {
		sizes: !sizes && kind === "w" ? "100vw" : sizes,
		srcSet,
		src: buildOptimizedUrl(src, last, quality),
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

function buildOptimizedUrl(
	sourceUrl: string,
	width: number,
	quality: number = DEFAULT_QUALITY,
): string {
	const params = new URLSearchParams()
	params.set("url", sourceUrl)
	params.set("w", String(Math.max(1, Math.round(width))))
	params.set("q", String(Math.min(100, Math.max(1, Math.round(quality)))))

	if (env.VITE_VERCEL_ENV === "development") {
		return `/api/image?${params.toString()}`
	}

	return `/_vercel/image?${params.toString()}`
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
				// Exit early in case of race condition:
				// - onload() is called
				// - decode() is called but incomplete
				// - unmount is called
				// - decode() completes
				return
			}

			if (onLoadRef.current) {
				// Since we don't have the SyntheticEvent here,
				// we must create one with the same shape.
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
			quality,
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
					// If the image has an error before react hydrates, then the error is lost.
					// The workaround is to wait until the image is mounted which is after hydration,
					// then we set the src again to trigger the error handler (if there was an error).
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
		const imgAttrs = generateImgAttrs(src, unoptimized, width, quality, sizes)

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
				// It's intended to keep `loading` before `src` because React updates
				// props in order which causes Safari/Firefox to not lazy load properly.
				// See https://github.com/facebook/react/issues/25883
				loading={loading}
				width={width}
				height={height}
				decoding={decoding}
				className={className}
				style={style}
				// It's intended to keep `src` the last attribute because React updates
				// attributes in order. If we keep `src` as the first one, Safari will
				// immediately start to fetch `src`, before `sizes` and `srcSet` are even
				// updated by React. That causes multiple unnecessary requests if `srcSet`
				// and `sizes` are defined.
				// This bug cannot be reproduced in Chrome or Firefox.
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
