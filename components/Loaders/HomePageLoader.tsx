import HeroSection from '../HeroSection/HeroSection'
import MapFiltersLoader from './MapFiltersLoader'
import MapGridLoader from './MapGridLoader'

interface HomePageLoaderProps {
  category?: string
}

export default function HomePageLoader({ category }: HomePageLoaderProps) {
  return (
    <div className="container flex flex-col gap-16 justify-center items-center">
      <HeroSection text={ category ?? 'Call of Duty: Zombies' } />
      <section className="flex flex-col gap-8 justify-center w-full">
        <h2 className="font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad]">Featured Maps</h2>
        <MapFiltersLoader />
        <MapGridLoader />
      </section>
    </div>
  )
}
