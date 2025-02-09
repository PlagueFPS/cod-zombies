// import Link from 'next/link'
import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import SearchBarLoader from '@/components/Loaders/SearchBarLoader'
import FeedbackForm from '@/components/FeedbackForm/FeedbackForm'
import { CustomLink } from '../CustomLink/CustomLink'

export default function Header() {
  return (
    <header className='sticky xl:static z-[100] bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 w-full' role='banner' tabIndex={ -1 }>
      <div className='container flex justify-between items-center w-full border-b border-border px-2 h-20'>
        <CustomLink href='/' aria-label='Go to Call of Duty: Zombies Guides Home Page'>
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
