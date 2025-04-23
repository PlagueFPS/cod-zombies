import HeroSection from '@/components/HeroSection/HeroSection'
import GridSection from '@/components/GridSection/GridSection'
import MapFiltersLoader from './MapFiltersLoader'
import GridLoader from './GridLoader'
import GridPaginationLoader from './GridPaginationLoader'

export default function HomeLoader() {
  return (
    <div className='container flex flex-col gap-12 justify-center items-center'>
      <HeroSection />
      <GridSection title='Main Quests'>
        <MapFiltersLoader />
        <GridLoader />
        <GridPaginationLoader />
      </GridSection>
    </div>
  )
}
