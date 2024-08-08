interface HeroSectionProps {
  text: string
}

export default function HeroSection({ text }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
      <h1 className="flex flex-col font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">
          Unlock the Secrets of
        </span>
        <span className="flex justify-center items-center gap-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2">
            Call of Duty: 
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-primary pb-2"> Zombies</span>
        </span>
      </h1>
      <p className="text-sm md:text-base lg:text-lg">
        Explore our comprehensive guides to the most challenging and rewarding main quests in { text }
      </p>
    </section>
  )
}
