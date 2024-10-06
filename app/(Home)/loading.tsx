import HeroSection from '@/components/HeroSection/HeroSection'

export default function HomeLoading() {
  return (
    <div className='container flex flex-col gap-16 justify-center items-center'>
      <HeroSection text='Call of Duty: Zombies' />
      <section className='flex flex-col gap-8 justify-center w-full'>
        <h2 className='font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-gradient'>Featured Maps</h2>
      </section>
    </div>
  )
}
