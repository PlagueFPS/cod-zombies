import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import GridSection from '@/components/GridSection/GridSection'
import PreviewCardLoader from '@/components/Loaders/PreviewCardLoader'
import { getAvailableMaps } from '@/data/interactive-map'

export default function MapsPageLoading() {
  const maps = getAvailableMaps()

  return (
    <div className='flex-col justify-center items-center w-full'>
      <div className='container flex flex-col gap-6 justify-center items-center'>
        <Breadcrumbs 
          links={[
            { title: "Maps", href: "/maps" }
          ]}
        />
        <GridSection title='Interactive Maps'>
          <p className='sm:text-lg text-muted-foreground -mt-6 mb-2'>
            Browse our collection of interactive maps showcasing key spawn points, locations, and more.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-center'>
            { maps.map((map, index) => (
              <PreviewCardLoader key={ `${map}-${index}-preview-loader` } />
            ))}
          </div>
        </GridSection>
      </div>
    </div>
  )
}
