import HeroSection from '@/components/hero-section/hero-section'
import GridSection from '@/components/grid-section/grid-section'
import MapFiltersLoader from '@/components/loaders/map-filters-loader'
import GridLoader from '@/components/loaders/grid-loader'
import GridPaginationLoader from '@/components/loaders/grid-pagination-loader'

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
