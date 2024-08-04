import Link from 'next/link'
import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import SearchBarLoader from '@/components/Loaders/SearchBarLoader'
import dynamic from 'next/dynamic'
import ThemeToggleLoader from '@/components/Loaders/ThemeToggleLoader'

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle/ThemeToggle'), {
  ssr: false,
  loading: () => <ThemeToggleLoader />
})

export default function Header() {
  return (
    <header className='sticky xl:static z-30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 w-full' role='banner' tabIndex={ -1 }>
      <div className='container flex justify-between items-center w-full border-b border-border px-2 h-20'>
        <Link href='/' aria-label='Go to Home Page'>
          <div className='font-extrabold text-xl sm:text-2xl text-center'>
            Call of Duty:
            <span className='text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-primary'> Zombies</span>
          </div>
        </Link>
        <div className='flex justify-between items-center h-full'>
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
