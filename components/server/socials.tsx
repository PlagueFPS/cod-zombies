import Discord from "@/components/server/discord-svg"
import { ExternalLink } from "@/components/server/external-link"
import GitHubSVG from "@/components/server/github-svg"
import Reddit from "@/components/server/reddit-svg"
import XSVG from "@/components/server/x-svg"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function Socials({
	children,
	className,
}: {
	children?: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn("flex items-center gap-3 text-muted-foreground", className)}>
			<ExternalLink
				href="https://x.com/CodZombiesGuide"
				title="Twitter"
				aria-label="Check out our Twitter profile"
				className="text-muted-foreground hover:text-primary"
			>
				<XSVG className="size-5" />
			</ExternalLink>
			<Separator orientation="vertical" className="min-h-5" />
			<ExternalLink
				href="https://discord.gg/callofduty"
				title="Discord"
				aria-label="Join the Official Call of Duty Discord"
				className="text-muted-foreground hover:text-primary"
			>
				<Discord className="size-5" />
			</ExternalLink>
			<Separator orientation="vertical" className="min-h-5" />
			<ExternalLink
				href="https://www.reddit.com/r/CODZombies/"
				title="Reddit"
				aria-label="Join the Official Call of Duty: Zombies Subreddit"
				className="text-muted-foreground hover:text-primary"
			>
				<Reddit className="size-5" />
			</ExternalLink>
			<Separator orientation="vertical" className="min-h-5" />
			<ExternalLink
				href="https://github.com/PlagueFPS/cod-zombies"
				title="GitHub"
				aria-label="Checkout our GitHub repository"
				className="text-muted-foreground hover:text-primary"
			>
				<GitHubSVG className="size-5" />
			</ExternalLink>
			{children}
		</div>
	)
}
