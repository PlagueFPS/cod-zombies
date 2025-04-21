import { Suspense } from "react"
import Copyright from "./Copyright/Copyright"
import CopyrightLoader from "../Loaders/CopyrightLoader"
import Newsletter from "../Newsletter/Newsletter"
import ContactForm from "../ContactForm/ContactForm"
import ThemeToggleWrapper from "../ThemeToggle/ThemeToggleWrapper"
import Discord from "@/SVGs/DiscordSVG"
import { Separator } from "../ui/seperator"
import Reddit from "@/SVGs/Reddit"
import ExternalLink from "../ExternalLink/ExternalLink"
import X from "@/SVGs/XSVG"
import FeedbackForm from "../FeedbackForm/FeedbackForm"
import MobileOnly from "../ui/mobile-only"

export default function Footer() {
  return (
    <footer className='container relative text-sm flex flex-col items-center py-8 px-4 border-t m-auto' role="contentinfo" tabIndex={ -1 }>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col-reverse order-last md:order-first items-center md:items-start justify-center gap-4 md:gap-6 text-center md:text-left">
          <Suspense fallback={<CopyrightLoader />}>
            <Copyright />
          </Suspense>
          <div className="flex items-center gap-3 text-muted-foreground">
            <ExternalLink href="https://x.com/CodZombiesGuide" title="Twitter" aria-label="Check out our Twitter profile">
              <X className="size-5" />
            </ExternalLink>
            <Separator orientation="vertical" className="h-5" />
            <ExternalLink href="https://discord.gg/callofduty" title="Discord" aria-label="Join the Official Call of Duty Discord">
              <Discord className="size-5" />
            </ExternalLink>
            <Separator orientation="vertical" className="h-5" />
            <ExternalLink href="https://www.reddit.com/r/CODZombies/" title="Reddit" aria-label="Join the Official Call of Duty: Zombies Subreddit">
              <Reddit className="size-5" />
            </ExternalLink>
          </div>
        </div>
        <Newsletter />
        <div className="flex justify-center md:justify-end space-x-4 order-first md:order-last">
          <div className="hidden sm:flex items-center gap-4">
            <ContactForm />
            <ThemeToggleWrapper />
          </div>
          <MobileOnly>
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex justify-center items-center gap-4">
                <ContactForm />
                <FeedbackForm />
              </div>
              <ThemeToggleWrapper />
            </div>
          </MobileOnly>
        </div>
      </div>
    </footer>
  )
}