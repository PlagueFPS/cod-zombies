"use client"
import HeroSection from '@/components/HeroSection/HeroSection'
import { capatilize, checkParams } from '@/utils/functions'
import { useParams } from 'next/navigation'

export default function CategoryLoading() {
  const { category } = useParams()
  const value = checkParams(category)
  return (
    <div className='container flex flex-col gap-16 justify-center items-center'>
      <HeroSection text={ value ? capatilize(value) : '' } />
      <section className='flex flex-col gap-8 justify-center w-full'>
        <h2 className='font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-gradient'>
          { value ? capatilize(value) : 'Featured Maps' }
        </h2>
      </section>
    </div>
  )
}
