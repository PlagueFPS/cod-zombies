"use client"
import { Copy, Share2 } from "lucide-react"
import { useState } from "react"
import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	RedditIcon,
	RedditShareButton,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
	XIcon,
} from "react-share"
import { toast } from "sonner"
import { Shortcut } from "@/components/client/shortcut"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"

interface ShareButtonProps extends React.ComponentProps<"button"> {
	title: string
	url: string
}

export function ShareButton({ title, url, ...props }: ShareButtonProps) {
	const [open, setOpen] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url)
		toast.success("URL Copied to Clipboard!", { duration: 1500, position: "bottom-center" })
		setOpen(false)
	}

	useShortcut("s", () => setOpen(prev => !prev))

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="ghost" size="icon" {...props} />}
					onClick={() => setOpen(true)}
					aria-label="open share modal. Keyboard shortcut: S"
				>
					<Share2 className="size-4" />
				</TooltipTrigger>
				<TooltipContent sideOffset={5} className="z-999 flex items-center justify-center gap-1">
					<Shortcut shortcuts="S" size="sm" variant="ghost" />
					<span>Share</span>
				</TooltipContent>
			</Tooltip>
			<DialogContent className="gap-6 rounded-lg">
				<DialogHeader>
					<DialogTitle>Share on Social Media</DialogTitle>
					<DialogDescription>
						Share a link of the current page to a social platform
					</DialogDescription>
				</DialogHeader>
				<div className="grid w-full grid-cols-3 items-center gap-y-4">
					<div className="flex flex-col items-center justify-center gap-2 text-xs">
						<TwitterShareButton url={url} title={title}>
							<XIcon size={40} round />
						</TwitterShareButton>
						<span>X</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-2 text-xs">
						<RedditShareButton url={url} title={title}>
							<RedditIcon size={40} round />
						</RedditShareButton>
						<span>Reddit</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-2 text-xs">
						<WhatsappShareButton url={url} title={title}>
							<WhatsappIcon size={40} round />
						</WhatsappShareButton>
						<span>WhatsApp</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-2 text-xs">
						<FacebookShareButton url={url} title={title}>
							<FacebookIcon size={40} round />
						</FacebookShareButton>
						<span>Facebook</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-2 text-xs">
						<LinkedinShareButton url={url} title={title}>
							<LinkedinIcon size={40} round />
						</LinkedinShareButton>
						<span>LinkedIn</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-2 text-xs">
						<EmailShareButton url={url} title={title}>
							<EmailIcon size={40} round />
						</EmailShareButton>
						<span>Email</span>
					</div>
				</div>
				<div className="flex w-full items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="link" className="sr-only">
							Link
						</Label>
						<Input id="link" defaultValue={url} readOnly className="text-sm" />
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="px-3 text-primary"
						onClick={handleCopy}
					>
						<span className="sr-only">Copy</span>
						<Copy className="h-4 w-4" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
