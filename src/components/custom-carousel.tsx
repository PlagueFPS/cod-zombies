"use client"
import { cn } from "cn"
import {
	Children,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useSyncExternalStore,
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
import { resolveCarouselIndicatorLayout } from "@/lib/embla-carousel/carousel-indicator-layout"

interface CustomCarouselProps {
	children: React.ReactNode
	className?: string
}

const INDICATORS_FALLBACK_STYLE: CSSProperties = {
	left: "50%",
	bottom: "5rem",
	transform: "translateX(-50%)",
}

export default function CustomCarousel({ children, className }: CustomCarouselProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const dotsPositionLockedRef = useRef(false)

	const [api, setApi] = useState<CarouselApi>()
	const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>(INDICATORS_FALLBACK_STYLE)

	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			if (!api) return () => {}
			api.on("select", onStoreChange)
			api.on("reInit", onStoreChange)
			return () => {
				api.off("select", onStoreChange)
				api.off("reInit", onStoreChange)
			}
		},
		[api],
	)

	const count = useSyncExternalStore(
		subscribe,
		() => api?.scrollSnapList().length ?? 0,
		() => 0,
	)
	const currentIndex = useSyncExternalStore(
		subscribe,
		() => api?.selectedScrollSnap() ?? 0,
		() => 0,
	)

	const tryLockDotsPosition = useCallback(() => {
		if (dotsPositionLockedRef.current) return

		const root = rootRef.current
		if (!root || count <= 1) return

		const img = firstSlideImg(root, api)
		const rootRect = root.getBoundingClientRect()
		const layout = resolveCarouselIndicatorLayout({
			hasImage: img != null,
			imageBox: img?.getBoundingClientRect() ?? null,
			imageComplete: img?.complete ?? false,
			rootBottom: rootRect.bottom,
		})

		if (layout.kind === "wait") return

		dotsPositionLockedRef.current = true
		if (layout.kind === "fallback") {
			setIndicatorStyle(INDICATORS_FALLBACK_STYLE)
			return
		}

		setIndicatorStyle({
			left: "50%",
			bottom: layout.bottomPx,
			transform: "translateX(-50%)",
		})
	}, [api, count])

	useLayoutEffect(() => {
		if (count <= 1) return
		tryLockDotsPosition()
	}, [count, tryLockDotsPosition])

	useEffect(() => {
		if (count <= 1 || dotsPositionLockedRef.current) return

		const root = rootRef.current
		if (!root) return

		const img = firstSlideImg(root, api)
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

	return (
		<Carousel ref={rootRef} setApi={setApi} className="w-full min-w-0">
			<CarouselContent className="min-w-0">
				{Children.toArray(children).map((child, index) => (
					<CarouselItem key={index} className={cn(className)}>
						{child}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious variant="default" size="icon" className="absolute left-2 flex md:left-4" />
			<CarouselNext variant="default" size="icon" className="absolute right-5 flex md:right-4" />
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
