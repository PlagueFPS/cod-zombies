import Link from 'next/link'
import React from 'react'
import NavLink from './NavLink/NavLink'

export default function Navbar() {
  return (
    <header>
      <nav className='fixed top-0 z-50 flex justify-between items-center w-full bg-secondary border-b border-accent-foreground px-2 h-20'>
        <Link href='/'>
          <h1 className='text-primary font-bold text-xl'>
            Call of Duty: Zombies
          </h1>
        </Link>
        <div className='hidden md:flex items-center px-4 h-full'>
          <NavLink href='/black-ops-1' className='flex items-center gap-2 h-fit rounded-md py-4 px-8 cursor-pointer text-primary hover:bg-primary hover:text-foreground'>
            <span>Black Ops 1</span>
          </NavLink>
          <NavLink href='/black-ops-2' className='flex items-center gap-2 h-fit rounded-md py-4 px-8 cursor-pointer text-primary hover:bg-primary hover:text-foreground'>
            <span>Black Ops 2</span>
          </NavLink>
          <NavLink href='/black-ops-3' className='flex items-center gap-2 h-fit rounded-md py-4 px-8 cursor-pointer text-primary hover:bg-primary hover:text-foreground'>
            <span>Black Ops 3</span>
          </NavLink>
          <NavLink href='/black-ops-4' className='flex items-center gap-2 h-fit rounded-md py-4 px-8 cursor-pointer text-primary hover:bg-primary hover:text-foreground'>
            <span>Black Ops 4</span>
          </NavLink>
          <NavLink href='/black-ops-cold-war' className='flex items-center gap-2 rounded-md h-fit py-4 px-8 cursor-pointer text-primary hover:bg-primary hover:text-foreground'>
            <span>Black Ops Cold War</span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
