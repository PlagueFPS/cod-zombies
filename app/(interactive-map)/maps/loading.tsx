import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import Footer from '@/components/footer/footer'
import GridSection from '@/components/grid-section/grid-section'
import PreviewCardLoader from '@/components/loaders/preview-card-loader'
import { getAvailableMaps } from '@/data/interactive-map'

export default function MapsPageLoading() {
  const maps = getAvailableMaps()

  return (
    <>
      <div className='flex-col justify-center items-center w-full mt-10'>
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
      <Footer />
    </>
  )
}
