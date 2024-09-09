import Link from 'next/link'
import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import SearchBarLoader from '@/components/Loaders/SearchBarLoader'

export default function Header() {
  return (
    <header className='sticky xl:static z-30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 w-full' role='banner' tabIndex={ -1 }>
      <div className='container flex justify-between items-center w-full border-b border-border px-2 h-20'>
        <Link href='/' aria-label='Go to Call of Duty: Zombies Guides Home Page'>
          <div className='font-extrabold text-xl sm:text-2xl text-center'>
            <span className='text-gradient'>
              Call of Duty:
            </span>
            <span className='text-primary-gradient'> Zombies</span>
          </div>
        </Link>
        <div className='flex justify-between items-center h-full'>
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
