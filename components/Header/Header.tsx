import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import SearchBarLoader from '@/components/Loaders/SearchBarLoader'
import FeedbackForm from '@/components/FeedbackForm/FeedbackForm'
import { CustomLink } from '../CustomLink/CustomLink'
import Image from 'next/image'
import Logo from "@/public/logo.webp"

export default function Header() {
  return (
    <header className='sticky xl:static z-[100] bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 w-full' role='banner' tabIndex={ -1 }>
      <div className='container flex justify-between items-center w-full border-b border-border px-2 h-20'>
        <CustomLink href='/' aria-label='Go to Home Page' className='flex items-center justify-center gap-2'>
          <Image
            unoptimized
            src={ Logo }
            alt='Call of Duty: Zombies Guides Logo'
            className='size-6 rounded'
          />
          <div className='font-extrabold text-xl sm:text-2xl text-center'>
            <span className='text-gradient'>
              COD:
            </span>
            <span className='text-primary-gradient'> Zombies Guides</span>
          </div>
        </CustomLink>
        <div className='flex justify-center items-center gap-2 w-fit h-full ml-auto'>
          <FeedbackForm />
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
