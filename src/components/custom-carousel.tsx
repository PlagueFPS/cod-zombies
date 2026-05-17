"use client"
import { ClientOnly } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface CustomCarouselProps {
	children: React.ReactNode
	className?: string
}

export default function CustomCarousel({ children, className }: CustomCarouselProps) {
	return (
		<ClientOnly>
			<InternalCarousel className={className}>{children}</InternalCarousel>
		</ClientOnly>
	)
}

function InternalCarousel({ children, className }: CustomCarouselProps) {
	const [api, setApi] = useState<CarouselApi>()
	const [currentIndex, setCurrentIndex] = useState(0)
	const [count, setCount] = useState(0)

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
		<Carousel setApi={setApi}>
			<CarouselContent>
				{Array.isArray(children) ? (
					children.map((child, index) => (
						<CarouselItem key={index} className={cn(className)}>
							{child}
						</CarouselItem>
					))
				) : (
					<CarouselItem className={cn(className)}>{children}</CarouselItem>
				)}
			</CarouselContent>
			<CarouselPrevious
				variant="secondary"
				size="icon"
				className="absolute left-2 flex md:left-4"
			/>
			<CarouselNext variant="secondary" size="icon" className="absolute right-5 flex md:right-4" />
			{count > 1 ? (
				<div
					className="pointer-events-auto absolute right-4 bottom-20 left-0 z-10 mx-auto inline-flex w-fit items-center justify-center gap-1 rounded-full border border-input/30 bg-black/65 px-2 py-1.5 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-black/45 md:bottom-15 dark:border-input"
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
