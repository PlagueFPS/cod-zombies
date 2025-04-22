import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import SearchBarLoader from '@/components/Loaders/SearchBarLoader'
import FeedbackForm from '@/components/FeedbackForm/FeedbackForm'
import { CustomLink } from '../CustomLink/CustomLink'
import Image from 'next/image'
import Logo from "@/public/logo.webp"
import { Book, Brain } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Header() {
  return (
    <header className='sticky z-100 top-0 w-full' role='banner' tabIndex={ -1 }>
      <div className='max-w-7xl mx-auto flex items-center w-full border-b sm:border sm:shadow-xl sm:rounded-md sm:mt-4 border-border px-2 h-16 bg-background/90 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
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
        <div className='hidden sm:flex justify-center items-center gap-8 w-fit h-full text-muted-foreground mr-8'>
          <CustomLink href='/side-quests' aria-label='Go to Side Quests page' className='flex items-center justify-center gap-2 hover:text-foreground transition-all'>
            <Book className='size-4 text-orange-400 dark:text-orange-200' />
            <span>Side Quests</span>
          </CustomLink>
          <CustomLink href='/bestiary' aria-label='Go to Bestiary page' className='flex items-center justify-center gap-2 hover:text-foreground transition-all'>
            <Brain className='size-4 text-orange-400 dark:text-orange-200' />
            <span>Bestiary</span>
          </CustomLink>
        </div>
        <div className='flex justify-center items-center gap-2 w-fit h-full'>
          <FeedbackForm className='hidden sm:flex' />
          <Suspense fallback={<SearchBarLoader />}>
            <SearchBar />
          </Suspense>
        </div>
        <Sidebar />
      </div>
    </header>
  )
}
