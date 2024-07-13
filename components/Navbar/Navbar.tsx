import Link from 'next/link'
import { Suspense } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import SearchBarLoader from '../Loaders/SearchBarLoader'
import dynamic from 'next/dynamic'
import ThemeToggleLoader from '../Loaders/ThemeToggleLoader'

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle/ThemeToggle'), {
  ssr: false,
  loading: () => <ThemeToggleLoader />
})

export default function Navbar() {
  return (
    <header>
      <div className='container flex justify-between items-center w-full border-b border-border px-2 h-20'>
        <Link href='/'>
          <h1 className='font-bold text-2xl text-center'>
            Call of Duty: <span className='text-primary'>Zombies</span>
          </h1>
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
