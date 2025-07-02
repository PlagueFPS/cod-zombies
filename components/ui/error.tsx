import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"

interface ErrorTitleProps {
	children: React.ReactNode
	className?: string
}

export function ErrorTitle({ children, className }: ErrorTitleProps) {
	return (
		<h1
			className={cn(
				`bg-linear-to-b from-[#545454] to-black bg-clip-text pb-2 text-center font-extrabold text-4xl text-transparent tracking-tight md:text-5xl lg:text-6xl dark:from-white dark:to-[#adadad]`,
				className,
			)}
		>
			{children}
		</h1>
	)
}

export function ErrorButton({ children, ...props }: React.ComponentProps<"button"> & ButtonProps) {
	return <Button {...props}>{children}</Button>
}

export function ErrorDescription({ children, className }: ErrorTitleProps) {
	return <p className={cn("max-w-[80ch] text-base lg:text-lg", className)}>{children}</p>
}
