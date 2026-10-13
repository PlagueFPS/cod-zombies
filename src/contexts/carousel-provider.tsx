import { createContext, use, type ReactNode } from "react"

type CarouselState = {
	expand: (index: number) => void
}

const CarouselContext = createContext<CarouselState | undefined>(undefined)

export function CarouselProvider({
	children,
	value,
}: {
	children: ReactNode
	value: CarouselState
}) {
	return <CarouselContext value={value}>{children}</CarouselContext>
}

export const useCarousel = () => {
	const context = use(CarouselContext)

	if (context === undefined) throw new Error("useCarousel must be used within a CarouselProvider")

	return context
}
