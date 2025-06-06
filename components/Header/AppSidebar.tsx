import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger, SheetTitle } from "../ui/sheet";
import { ROUTES } from "@/utils/constants";
import { CustomLink } from "../CustomLink/CustomLink";
import ExternalLink from "../ExternalLink/ExternalLink";
import { Separator } from "../ui/separator";
import Discord from "@/SVGs/DiscordSVG";
import Reddit from "@/SVGs/Reddit";
import X from "@/SVGs/XSVG";
import Logo from "@/public/logo.webp"
import Image from "next/image";
import ThemeToggleWrapper from "../ThemeToggle/ThemeToggleWrapper";
import NavLink from "../NavLink/NavLink";

export default function AppSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" title="Toggle Nav" asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Menu className="text-muted-foreground size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col z-900">
        <SheetTitle className="sr-only">Sidebar</SheetTitle>
        <SheetHeader className="border-b w-full pb-4">
          <SheetClose asChild>
            <CustomLink href={'/'} aria-label="Go to Home Page" className="flex items-center justify-center gap-2">
              <Image 
                unoptimized
                src={ Logo }
                alt='Call of Duty: Zombies Guides Logo'
                className='size-5 rounded'
              />
              <div className='font-extrabold text-xl text-center'>
                <span className='text-gradient dark:dark-text-gradient'>
                  COD:
                </span>
                <span className='text-primary-gradient'> Zombies Guides</span>
            </div>
            </CustomLink>
          </SheetClose>
        </SheetHeader>
        <nav className="flex flex-col items-start gap-6 pl-4 text-lg pb-4 w-full">
          { ROUTES.map(route => (
            <SheetClose key={ route.id } asChild>
              <NavLink
                href={ route.href } 
                aria-label={`Go to ${route.title} page`} 
                className='flex items-center justify-center gap-2 transition-all'
              >
                <route.icon className='size-5 text-orange-400 dark:text-orange-200' />
                <span className="font-medium">{ route.title }</span>
              </NavLink>
            </SheetClose>
          ))}
        </nav>
        <SheetFooter className="flex flex-col justify-center items-center w-full gap-4 text-muted-foreground mt-auto mb-4 border-t">
          <ThemeToggleWrapper />
          <div className="flex justify-evenly items-center gap-3 w-full">
            <ExternalLink href="https://x.com/CodZombiesGuide" title="Twitter" aria-label="Check out our Twitter profile">
              <X className="size-5" />
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
