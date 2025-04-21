import { Book, Brain, Home, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "../ui/sheet";
import { CustomLink } from "../CustomLink/CustomLink";
import ExternalLink from "../ExternalLink/ExternalLink";
import { Separator } from "../ui/seperator";
import Discord from "@/SVGs/DiscordSVG";
import Reddit from "@/SVGs/Reddit";
import X from "@/SVGs/XSVG";
import Logo from "@/public/logo.webp"
import Image from "next/image";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger className="sm:hidden" title="Toggle Nav" asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Menu className="text-muted-foreground size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col z-[200]">
        <SheetHeader className="border-b w-full pb-4 mt-4">
          <CustomLink href={'/'} aria-label="Go to Home Page" className="flex items-center justify-center gap-2">
            <Image 
              unoptimized
              src={ Logo }
              alt='Call of Duty: Zombies Guides Logo'
              className='size-5 rounded'
            />
            <div className='font-extrabold text-xl text-center'>
              <span className='text-gradient'>
                COD:
              </span>
              <span className='text-primary-gradient'> Zombies Guides</span>
          </div>
          </CustomLink>
        </SheetHeader>
        <div className="flex flex-col items-start gap-6 px-2 text-muted-foreground text-lg pb-4 w-full">
          <CustomLink href='/' aria-label='Go to Side Quests page' className='flex items-center justify-center gap-2 hover:text-foreground transition-all'>
            <Home className='size-5 text-orange-400 dark:text-orange-200' />
            <span>Home</span>
          </CustomLink>
          <CustomLink href='/side-quests' aria-label='Go to Side Quests page' className='flex items-center justify-center gap-2 hover:text-foreground transition-all'>
            <Book className='size-5 text-orange-400 dark:text-orange-200' />
            <span>Side Quests</span>
          </CustomLink>
          <CustomLink href='/bestiary' aria-label='Go to Bestiary page' className='flex items-center justify-center gap-2 hover:text-foreground transition-all'>
            <Brain className='size-5 text-orange-400 dark:text-orange-200' />
            <span>Bestiary</span>
          </CustomLink>
        </div>
        <SheetFooter className="flex flex-row justify-evenly items-center w-full gap-3 text-muted-foreground mt-auto">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
