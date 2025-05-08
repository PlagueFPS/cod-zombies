import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import { Skeleton } from '@/components/ui/skeleton'

export default function PrivacyPolicyLoading() {
  return (
    <article className="flex justify-center w-full">
      <div className="flex flex-col justify-start items-center max-w-(--desktop) mx-auto xl:mx-4 w-full">
        <div className="flex flex-col-reverse xl:flex-row grow w-full justify-center">
          <section className="flex flex-col items-center justify-center w-full max-w-7xl">
            <div className="relative w-full mt-4 xl:my-6">
              <div className="absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center">
                <Breadcrumbs links={[
                  { title: "Privacy Policy", href: `/privacy-policy` }
                ]} />
              </div>
            </div>
            <div className="flex flex-col justify-center items-start md:gap-4 px-4 pb-6 mb-4 md:px-8 w-full border-b-2">
              <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-gradient dark:dark-text-gradient pb-2">
                Privacy Policy
              </h2>
              <span className="text-muted-foreground text-sm">Last Updated: { <Skeleton className='inline-block w-20 h-2.5' /> }</span>
            </div>
            <Skeleton className='h-[150dvh] w-full max-w-[80ch] dark:bg-accent/50' />
          </section>
        </div>
      </div>
    </article>
  )
}
