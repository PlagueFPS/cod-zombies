import HeroSection from '@/components/HeroSection/HeroSection'
import GridSection from '@/components/GridSection/GridSection'
import MapFiltersLoader from './MapFiltersLoader'
import MapGridLoader from './MapGridLoader'
import MapPaginationLoader from './MapPaginationLoader'

export default function HomeLoader() {
  return (
    <div className='container flex flex-col gap-16 justify-center items-center'>
      <HeroSection />
      <GridSection title='Main Quests'>
        <MapFiltersLoader />
        <MapGridLoader />
        <MapPaginationLoader />
      </GridSection>
    </div>
  )
}
