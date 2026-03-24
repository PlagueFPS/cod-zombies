"use client"

import type React from "react"
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

interface CustomCarouselProps {
	children: React.ReactNode
	className?: string
}

export default function CustomCarousel({ children, className }: CustomCarouselProps) {
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
		<>
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
				<CarouselPrevious variant="secondary" />
				<CarouselNext variant="secondary" />
			</Carousel>
			{count > 1 ? (
				<div className="flex justify-center gap-1.5" role="tablist" aria-label="Carousel slides">
					{Array.from({ length: count }, (_, i) => (
						<button
							key={i}
							type="button"
							aria-current={i === currentIndex}
							aria-label={`Slide ${i + 1} of ${count}`}
							className={cn(
								"h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,transform] duration-200",
								i === currentIndex
									? "scale-110 bg-muted-foreground"
									: "bg-muted-foreground/35 hover:bg-muted-foreground/55",
							)}
							onClick={() => api?.scrollTo(i)}
						/>
					))}
				</div>
			) : null}
		</>
	)
}
