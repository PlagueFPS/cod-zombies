// import Link from "next/link"
import { Button } from "../ui/button"
import { Book } from "lucide-react"
import { NewBadge } from "../CustomBadges/CustomBadges"
import { CustomLink } from "../CustomLink/CustomLink"

interface HeroSectionProps {
  text: string
}

export default function HeroSection({ text }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
      <h1 className="flex flex-col font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="text-gradient">
          Unlock the Secrets of
        </span>
        <span className="flex justify-center items-center gap-3">
          <span className="text-gradient pb-2">
            Call of Duty: 
          </span>
          <span className="text-primary-gradient pb-2">Zombies</span>
        </span>
      </h1>
      <p className="text-base md:text-lg">
        Explore our comprehensive guides to the most challenging and rewarding Main Quests and Easter Eggs in { text }
      </p>
      <div className="flex items-center justify-center w-full mt-8">
        <Button asChild variant={"outline"} size={"sm"} className="badge-primary-gradient">
          <CustomLink href="/side-quests" className="relative flex gap-2 rounded-sm items-center justify-center">
            <NewBadge className="absolute -top-3 -right-3" />
            <Book className="size-4" />
            <span>View Side Quests</span>
          </CustomLink>
        </Button>
      </div>
    </section>
  )
}
