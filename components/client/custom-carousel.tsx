"use client"
import {
	Children,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
} from "react"
import { Button } from "@/components/ui/button"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	type CarouselApi,
} from "@/components/ui/carousel"
import { firstSlideImg } from "@/lib/embla-carousel/carousel-first-slide"
import { cn } from "@/lib/utils"

interface CustomCarouselProps {
	children: React.ReactNode
	className?: string
}

/** Pixels above the `<img>` bottom edge (inside the image area). */
const INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX = 12
/** Ignore bbox reads before layout resolves (FeaturedImage fades in; lazy decode). */
const MIN_IMG_BOX_FOR_LAYOUT_PX = 4

const INDICATORS_FALLBACK_STYLE: CSSProperties = {
	left: "50%",
	bottom: "5rem",
	transform: "translateX(-50%)",
}

export default function CustomCarousel({ children, className }: CustomCarouselProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const dotsPositionLockedRef = useRef(false)
	/**
	 * This ref avoids listing `api` on `tryLockDotsPosition` deps so its identity
	 * stays stable while reads still see the live API.
	 */
	const apiRef = useRef<CarouselApi | undefined>(undefined)

	const [api, setApi] = useState<CarouselApi>()
	const [currentIndex, setCurrentIndex] = useState(0)
	const [count, setCount] = useState(0)
	const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>(INDICATORS_FALLBACK_STYLE)

	apiRef.current = api

	const tryLockDotsPosition = useCallback(() => {
		if (dotsPositionLockedRef.current) return

		const root = rootRef.current
		if (!root || count <= 1) return

		const img = firstSlideImg(root, apiRef.current)

		if (img == null) {
			dotsPositionLockedRef.current = true
			setIndicatorStyle(INDICATORS_FALLBACK_STYLE)
			return
		}

		const rootRect = root.getBoundingClientRect()
		const imgRect = img.getBoundingClientRect()

		if (imgRect.height < MIN_IMG_BOX_FOR_LAYOUT_PX || imgRect.width < MIN_IMG_BOX_FOR_LAYOUT_PX) {
			if (img.complete) {
				dotsPositionLockedRef.current = true
				setIndicatorStyle(INDICATORS_FALLBACK_STYLE)
			}
			return
		}

		dotsPositionLockedRef.current = true
		setIndicatorStyle({
			left: "50%",
			bottom: rootRect.bottom - imgRect.bottom + INDICATOR_INSET_FROM_IMAGE_BOTTOM_PX,
			transform: "translateX(-50%)",
		})
	}, [count])

	useLayoutEffect(() => {
		if (count <= 1) return
		tryLockDotsPosition()
	}, [count, tryLockDotsPosition])

	useEffect(() => {
		if (count <= 1 || dotsPositionLockedRef.current) return

		const root = rootRef.current
		if (!root) return

		const img = firstSlideImg(root, apiRef.current)
		if (!img) {
			tryLockDotsPosition()
			return
		}

		const onReady = () => tryLockDotsPosition()

		img.addEventListener("load", onReady, { once: true })

		let decodeCancelled = false
		void (img.decode?.() ?? Promise.resolve())
			.catch(() => {})
			.then(() => {
				if (!decodeCancelled && img.isConnected) tryLockDotsPosition()
			})

		return () => {
			decodeCancelled = true
			img.removeEventListener("load", onReady)
		}
	}, [api, count, tryLockDotsPosition])

	useEffect(() => {
		if (!api) return

		setCount(api.scrollSnapList().length)
		setCurrentIndex(api.selectedScrollSnap())

		const onSelect = () => {
			setCurrentIndex(api.selectedScrollSnap())
		}

		api.on("select", onSelect)
		return () => {
			api.off("select", onSelect)
		}
	}, [api])

	return (
		<Carousel ref={rootRef} setApi={setApi} className="w-full min-w-0">
			<CarouselContent className="min-w-0">
				{Children.toArray(children).map((child, index) => (
					<CarouselItem key={index} className={cn(className)}>
						{child}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious
				variant="secondary"
				size="icon"
				className="absolute left-2 flex md:left-4"
			/>
			<CarouselNext variant="secondary" size="icon" className="absolute right-5 flex md:right-4" />
			{count > 1 ? (
				<div
					style={indicatorStyle}
					className="pointer-events-auto absolute z-10 inline-flex w-fit items-center justify-center gap-1 rounded-full border border-input/30 bg-black/65 px-2 py-1.5 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-black/45 dark:border-input"
					role="tablist"
					aria-label="Carousel slides"
				>
					{Array.from({ length: count }, (_, i) => (
						<Button
							key={i}
							size="icon-xs"
							aria-current={i === currentIndex}
							aria-label={`Slide ${i + 1} of ${count}`}
							className={cn(
								"h-2 w-2 shrink-0 rounded-full transition-[background-color,transform] duration-200 md:h-2.5 md:w-2.5",
								i === currentIndex
									? "scale-110 bg-primary"
									: "bg-muted-foreground/35 hover:bg-muted-foreground/55",
							)}
							onClick={() => api?.scrollTo(i)}
						/>
					))}
				</div>
			) : null}
		</Carousel>
	)
}
