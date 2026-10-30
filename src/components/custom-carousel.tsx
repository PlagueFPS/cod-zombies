import type { RichImageProps } from "@/components/rich-image"
import { cn } from "cn"
import { Predicate } from "effect"
import {
	Children,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type CSSProperties,
	type ReactElement,
	type RefObject,
} from "react"
import { CarouselImage, ExpandedCarouselImage } from "@/components/carousel-image"
import { Button } from "@/components/ui/button"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	type CarouselApi,
} from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { CarouselProvider } from "@/contexts/carousel-provider"
import { firstSlideImg } from "@/lib/embla-carousel/carousel-first-slide"
import { resolveCarouselIndicatorLayout } from "@/lib/embla-carousel/carousel-indicator-layout"

interface CustomCarouselProps {
	children: ReactElement<RichImageProps> | readonly ReactElement<RichImageProps>[]
	className?: string
}

const INDICATORS_FALLBACK_STYLE: CSSProperties = {
	left: "50%",
	bottom: "5rem",
	transform: "translateX(-50%)",
}

function useCarouselSelection(api: CarouselApi) {
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			if (!(Predicate.isNotNullish(api) && Predicate.isTruthy(api))) return () => {}

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

	return { count, currentIndex }
}

function CarouselSlides({
	api,
	style,
	className,
}: {
	api: CarouselApi
	style?: CSSProperties
	className?: string
}) {
	const { count, currentIndex } = useCarouselSelection(api)

	if (count <= 1) return null

	return (
		<div
			style={style}
			className={cn(
				"pointer-events-auto z-10 inline-flex w-fit items-center justify-center gap-1 rounded-full border border-input/30 bg-black/65 px-2 py-1.5 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-black/45 dark:border-input",
				className,
			)}
			role="tablist"
			aria-label="Carousel slides"
		>
			{Array.from({ length: count }, (_, index) => (
				<Button
					key={index}
					size="icon-xs"
					aria-current={index === currentIndex}
					aria-label={`Slide ${index + 1} of ${count}`}
					className={cn(
						"h-2 w-2 shrink-0 rounded-full transition-[background-color,transform] duration-200 md:h-2.5 md:w-2.5",
						index === currentIndex ? "scale-110 bg-primary" : "bg-white/55 hover:bg-white/75",
					)}
					onClick={() => api?.scrollTo(index)}
				/>
			))}
		</div>
	)
}

function ExpandedCarousel({
	children,
	startIndex,
	onSelect,
	rootRef,
}: Pick<CustomCarouselProps, "children"> & {
	startIndex: number
	onSelect: (index: number) => void
	rootRef: RefObject<HTMLDivElement | null>
}) {
	const [api, setApi] = useState<CarouselApi>()
	const { count } = useCarouselSelection(api)

	useEffect(() => {
		if (!(Predicate.isNotNullish(api) && Predicate.isTruthy(api))) return

		const syncSelection = () => onSelect(api.selectedScrollSnap())
		api.on("select", syncSelection)

		return () => {
			api.off("select", syncSelection)
		}
	}, [api, onSelect])

	return (
		<Carousel
			ref={rootRef}
			tabIndex={-1}
			setApi={setApi}
			opts={{ startIndex }}
			className="w-full min-w-0 outline-none"
		>
			<CarouselContent className="ml-0 touch-pan-y touch-pinch-zoom">
				{Children.map(children, (child, index) => (
					<CarouselItem key={index} className="pl-0">
						<ExpandedCarouselImage {...child.props} />
					</CarouselItem>
				))}
			</CarouselContent>
			{count > 1 ? (
				<div className="contents" onClick={event => event.stopPropagation()}>
					<CarouselPrevious variant="default" size="icon" className="left-2 md:left-4" />
					<CarouselNext variant="default" size="icon" className="right-2 md:right-4" />
					<CarouselSlides api={api} className="mx-auto mt-3 flex" />
				</div>
			) : null}
		</Carousel>
	)
}

export default function CustomCarousel({ children, className }: CustomCarouselProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const expandedRootRef = useRef<HTMLDivElement>(null)
	const dotsPositionLockedRef = useRef(false)

	const [api, setApi] = useState<CarouselApi>()
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
	const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>(INDICATORS_FALLBACK_STYLE)
	const { count } = useCarouselSelection(api)

	const tryLockDotsPosition = useCallback(() => {
		if (dotsPositionLockedRef.current) return

		const root = rootRef.current

		if (!(Predicate.isNotNullish(root) && Predicate.isTruthy(root)) || count <= 1) return

		const img = firstSlideImg(root, api)
		const rootRect = root.getBoundingClientRect()

		const layout = resolveCarouselIndicatorLayout({
			hasImage: Predicate.isNotNullish(img),
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

		if (!(Predicate.isNotNullish(root) && Predicate.isTruthy(root))) return

		const img = firstSlideImg(root, api)

		if (!(Predicate.isNotNullish(img) && Predicate.isTruthy(img))) {
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
		<CarouselProvider value={{ expand: setExpandedIndex }}>
			<Dialog
				open={Predicate.isNotNull(expandedIndex)}
				onOpenChange={open => {
					if (!open) setExpandedIndex(null)
				}}
			>
				<Carousel ref={rootRef} setApi={setApi} className="w-full min-w-0">
					<CarouselContent className="min-w-0">
						{Children.map(children, (child, index) => (
							<CarouselItem key={index} className={cn(className)}>
								<CarouselImage {...child.props} index={index} />
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious
						variant="default"
						size="icon"
						className="absolute left-2 flex md:left-4"
					/>
					<CarouselNext
						variant="default"
						size="icon"
						className="absolute right-5 flex md:right-4"
					/>
					<CarouselSlides api={api} style={indicatorStyle} className="absolute" />
				</Carousel>
				<DialogContent
					className="cursor-zoom-out border-none bg-transparent p-0 ring-0 sm:max-w-[90vw]"
					showCloseButton={false}
					initialFocus={expandedRootRef}
					onClick={() => setExpandedIndex(null)}
					finalFocus={() =>
						api
							?.slideNodes()
							[api.selectedScrollSnap()]?.querySelector<HTMLButtonElement>(
								"[data-slot='dialog-trigger']",
							) ?? null
					}
				>
					<DialogTitle className="sr-only">Image carousel</DialogTitle>
					<DialogDescription className="sr-only">
						Swipe or use the arrow keys and navigation buttons to browse the images. Click the image
						or outside the viewer to close it.
					</DialogDescription>
					{Predicate.isNotNull(expandedIndex) ? (
						<ExpandedCarousel
							startIndex={expandedIndex}
							rootRef={expandedRootRef}
							onSelect={index => api?.scrollTo(index, true)}
						>
							{children}
						</ExpandedCarousel>
					) : null}
				</DialogContent>
			</Dialog>
		</CarouselProvider>
	)
}
