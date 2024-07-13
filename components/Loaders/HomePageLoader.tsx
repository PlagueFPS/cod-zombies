import MapFiltersLoader from './MapFiltersLoader'
import MapGridLoader from './MapGridLoader'

interface HomePageLoaderProps {
  category?: string
}

export default function HomePageLoader({ category }: HomePageLoaderProps) {
  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Unlock the Secrets of Call of Duty: <span className="text-primary">Zombies</span>
        </h2>
        <p className="text-foreground/90 text-sm md:text-base lg:text-lg">
          Explore our comprehensive guides to the most challenging and rewarding easter eggs in { category ?? "the Call of Duty Zombies universe"}
        </p>
      </section>
      <section className="flex flex-col gap-8 justify-center w-full">
        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">Featured Maps</h2>
        <MapFiltersLoader />
        <MapGridLoader />
      </section>
    </div>
  )
}
