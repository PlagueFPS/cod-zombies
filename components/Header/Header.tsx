import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import SearchBarLoader from '@/components/Loaders/SearchBarLoader'
import FeedbackForm from '@/components/FeedbackForm/FeedbackForm'
import { CustomLink } from '../CustomLink/CustomLink'
import Image from 'next/image'
import Logo from "@/public/logo.webp"
import { ROUTES } from '@/utils/constants'
import Sidebar from './Sidebar'

export default function Header() {
  return (
    <header className='sticky z-100 top-0 w-full lg:px-4' tabIndex={ -1 }>
      <div className='max-w-7xl mx-auto flex items-center w-full border-b lg:border-2 lg:shadow-lg lg:dark:shadow-none lg:rounded-md lg:mt-4 px-2 h-16 bg-background/90 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs'>
        <CustomLink href='/' aria-label='Go to Home Page' className='flex items-center justify-center gap-2 mr-auto'>
          <Image
            unoptimized
            src={ Logo }
            alt='Call of Duty: Zombies Guides Logo'
            className='size-5 rounded'
          />
          <div className='font-extrabold text-xl text-center'>
            <span className='text-gradient dark:dark-text-gradient'>
              COD:
            </span>
            <span className='text-primary-gradient'> Zombies Guides</span>
          </div>
        </CustomLink>
        <nav className='hidden lg:flex justify-center items-center gap-8 w-fit h-full text-muted-foreground mr-8'>
          { ROUTES.map(route => (
            <CustomLink 
              key={ route.id } 
              href={ route.href } 
              aria-label={`Go to ${route.title} page`}
              className='flex items-center justify-center gap-2 hover:text-foreground transition-all'
            >
              <route.icon className='size-4 text-orange-400 dark:text-orange-200' />
              <span className='text-shadow-2xs text-shadow-white dark:text-shadow-none font-medium'>{ route.title }</span>
            </CustomLink>
          ))}
        </nav>
        <div className='flex justify-center items-center gap-2 w-fit h-full'>
          <FeedbackForm className='hidden lg:flex' />
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar />
          </Suspense>
        </div>
        <Sidebar />
      </div>
    </header>
  )
}
