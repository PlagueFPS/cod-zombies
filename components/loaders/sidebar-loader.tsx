import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { PanelLeftClose } from 'lucide-react'
import ExternalLink from '../external-link/external-link'
import XSVG from '@/SVGs/XSVG'
import { Separator } from '../ui/separator'
import Discord from '@/SVGs/DiscordSVG'
import Reddit from '@/SVGs/Reddit'

export default function SidebarLoader() {
  return (
    <div className="relative hidden lg:flex flex-col w-2xs h-screen bg-background border border-t-0 -mt-10">
      <div className="sticky top-0 flex items-center gap-2 w-full border-b p-2">
        <Skeleton className="h-7 w-50" />
        <PanelLeftClose className="size-4 ml-auto" />
      </div>
      <div className="flex flex-col items-center h-full gap-4 p-4">
        { Array.from({ length: 12 }, (_, index) => (
          <Skeleton key={ index } className="w-full h-10" />
        ))}
      </div>
      <div className="sticky bottom-0 border-t px-2 py-4">
        <div className="flex justify-evenly items-center gap-3 text-muted-foreground">
          <ExternalLink href="https://x.com/CodZombiesGuide" title="Twitter" aria-label="Check out our Twitter profile">
            <XSVG className="size-5" />
          </ExternalLink>
          <Separator orientation="vertical" className="min-h-5" />
          <ExternalLink href="https://discord.gg/callofduty" title="Discord" aria-label="Join the Official Call of Duty Discord">
            <Discord className="size-5" />
          </ExternalLink>
          <Separator orientation="vertical" className="min-h-5" />
          <ExternalLink href="https://www.reddit.com/r/CODZombies/" title="Reddit" aria-label="Join the Official Call of Duty: Zombies Subreddit">
            <Reddit className="size-5" />
          </ExternalLink>
        </div>
      </div>
    </div>
  )
}
