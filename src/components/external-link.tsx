import { cn } from "cn"

export function ExternalLink({
	children,
	className,
	...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">) {
	return (
		<a
			{...props}
			target="_blank"
			rel="noopener noreferrer"
			className={cn("text-primary transition-all hover:underline", className)}
		>
			{children}
		</a>
	)
}
