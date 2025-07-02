import { Suspense } from "react"
import Discord from "@/SVGs/DiscordSVG"
import Reddit from "@/SVGs/Reddit"
import X from "@/SVGs/XSVG"
import ContactForm from "../contact-form/contact-form"
import { CustomLink } from "../custom-link/custom-link"
import ExternalLink from "../external-link/external-link"
import CopyrightLoader from "../loaders/copyright-loader"
import Newsletter from "../newsletter/newsletter"
import ThemeToggleWrapper from "../theme-toggle/theme-toggle-wrapper"
import { Separator } from "../ui/separator"
import Copyright from "./copyright/copyright"

export default function Footer() {
	return (
		<footer className="container relative m-auto flex flex-col items-center border-t px-4 py-8 text-sm">
			<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
				<div className="order-last flex flex-col-reverse items-center justify-center gap-4 text-center md:order-first md:items-start md:gap-6 md:text-left">
					<Suspense fallback={<CopyrightLoader />}>
						<Copyright />
					</Suspense>
					<div className="flex items-center gap-3 text-muted-foreground">
						<ExternalLink
							href="https://x.com/CodZombiesGuide"
							title="Twitter"
							aria-label="Check out our Twitter profile"
						>
							<X className="size-5" />
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
				<Newsletter />
				<div className="order-first flex justify-center space-x-4 md:order-last md:justify-end">
					<div className="flex items-center gap-4">
						<ContactForm />
						<ThemeToggleWrapper />
					</div>
				</div>
			</div>
			<div className="flex w-full items-center justify-center text-muted-foreground text-xs md:mt-2 md:justify-start">
				<CustomLink
					prefetch={false}
					href={"/privacy-policy"}
					className="underline underline-offset-2 hover:text-foreground hover:no-underline dark:hover:text-foreground/80"
				>
					Privacy Policy
				</CustomLink>
			</div>
		</footer>
	)
}
