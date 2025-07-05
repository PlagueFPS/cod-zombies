import { PanelLeftClose } from "lucide-react"
import Discord from "@/components/SVGs/DiscordSVG"
import Reddit from "@/components/SVGs/Reddit"
import XSVG from "@/components/SVGs/XSVG"
import ExternalLink from "../external-link/external-link"
import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"

export default function SidebarLoader() {
	return (
		<div className="-mt-10 relative hidden h-screen w-2xs flex-col border border-t-0 bg-background lg:flex">
			<div className="sticky top-0 flex w-full items-center gap-2 border-b p-2">
				<Skeleton className="h-7 w-50" />
				<PanelLeftClose className="ml-auto size-4" />
			</div>
			<div className="flex h-full flex-col items-center gap-4 p-4">
				{Array.from({ length: 12 }, (_, index) => (
					<Skeleton key={`sidebar-loader-${index + 1}`} className="h-10 w-full" />
				))}
			</div>
			<div className="sticky bottom-0 border-t px-2 py-4">
				<div className="flex items-center justify-evenly gap-3 text-muted-foreground">
					<ExternalLink href="https://x.com/CodZombiesGuide" title="Twitter" aria-label="Check out our Twitter profile">
						<XSVG className="size-5" />
					</ExternalLink>
					<Separator orientation="vertical" className="min-h-5" />
					<ExternalLink
						href="https://discord.gg/callofduty"
						title="Discord"
						aria-label="Join the Official Call of Duty Discord"
					>
						<Discord className="size-5" />
					</ExternalLink>
					<Separator orientation="vertical" className="min-h-5" />
					<ExternalLink
						href="https://www.reddit.com/r/CODZombies/"
						title="Reddit"
						aria-label="Join the Official Call of Duty: Zombies Subreddit"
					>
						<Reddit className="size-5" />
					</ExternalLink>
				</div>
			</div>
		</div>
	)
}
