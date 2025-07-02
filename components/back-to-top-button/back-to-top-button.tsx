"use client"
import { ArrowUp } from "lucide-react"
import { Button, type ButtonProps } from "../ui/button"

interface BackToTopButtonProps extends React.ComponentProps<"button"> {
	mobile?: boolean
}

export default function BackToTopButton({ mobile, ...props }: BackToTopButtonProps & ButtonProps) {
	const scrollBackToTop = () => {
		window.scroll({ left: 0, top: 0 })
	}

	return (
		<>
			{mobile ? (
				<Button
					onClick={scrollBackToTop}
					size="icon"
					className="fixed right-4 bottom-16 z-20 rounded-full xl:hidden"
					title="Back to Top"
					{...props}
				>
					<ArrowUp className="h-6 w-6" />
				</Button>
			) : (
				<Button onClick={scrollBackToTop} {...props}>
					Back to Top
				</Button>
			)}
		</>
	)
}
