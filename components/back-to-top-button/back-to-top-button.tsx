"use client"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "../ui/button"

interface BackToTopButtonProps extends React.ComponentProps<"button"> {
	mobile?: boolean
}

export default function BackToTopButton({ mobile, className, ...props }: BackToTopButtonProps & ButtonProps) {
	const scrollBackToTop = () => {
		window.scroll({ top: 0, behavior: "smooth" })
	}

	return (
		<>
			{mobile ? (
				<Button
					onClick={scrollBackToTop}
					size="icon"
					className={cn("fixed right-4 bottom-16 z-20 rounded-full", className)}
					title="Back to Top"
					{...props}
				>
					<ArrowUp className="size-6" />
				</Button>
			) : (
				<Button onClick={scrollBackToTop} className={ className } {...props}>
					Back to Top
				</Button>
			)}
		</>
	)
}
