"use client"
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys"
import { CheckIcon, Link2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Shortcut } from "@/components/client/shortcut"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ShareButtonProps extends React.ComponentProps<"button"> {
	/** The URL to copy to the clipboard */
	url: string
	/** Whether to render only the icon without the button text @default true */
	withText?: boolean
}

export function ShareButton({ url, withText = true, ...props }: ShareButtonProps) {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url)
			toast.success("URL copied to clipboard!", {
				position: "top-right",
				duration: 2000,
				closeButton: false,
			})
			setIsCopied(true)
		} catch (e) {
			console.error(e)
			toast.error("Failed to copy URL to clipboard.", {
				position: "top-right",
				duration: 2000,
				closeButton: false,
			})
		}
	}

	useHotkey("Mod+Shift+C", () => handleCopy(), { requireReset: true, conflictBehavior: "replace" })

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined

		if (isCopied) {
			timer = setTimeout(() => {
				setIsCopied(false)
			}, 3000)
		}

		return () => clearTimeout(timer)
	}, [isCopied])

	return (
		<Tooltip>
			<TooltipTrigger
				render={<Button variant="ghost" size={withText ? "sm" : "icon"} {...props} />}
				onClick={handleCopy}
				aria-label={`Copy URL. Keyboard shortcut: ${formatForDisplay("Mod+Shift+C")}`}
				className={cn(
					"flex items-center gap-1 pl-0 text-muted-foreground transition-all hover:bg-transparent dark:hover:bg-transparent",
					{
						"text-green-500 hover:text-green-500 dark:text-green-500 dark:hover:text-green-500":
							isCopied,
					},
					props.className,
				)}
			>
				{isCopied ? (
					<>
						<CheckIcon className="size-4" />
						{withText && <span>Copied URL</span>}
					</>
				) : (
					<>
						<Link2Icon className="size-4" />
						{withText && <span>Copy URL</span>}
					</>
				)}
			</TooltipTrigger>
			<TooltipContent sideOffset={5} className="z-999 flex items-center justify-center gap-1">
				<Shortcut shortcut="Mod+Shift+C" size="sm" variant="ghost" />
				{!withText && <span>Copy URL</span>}
			</TooltipContent>
		</Tooltip>
	)
}
