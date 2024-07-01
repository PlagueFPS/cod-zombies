import Link from 'next/link'
import React from 'react'
import NavLink from './NavLink/NavLink'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import Sidebar from './Sidebar/Sidebar'

export default function Navbar() {
  return (
    <header>
      <nav className='container flex justify-between items-center w-full border-b border-border px-2 h-20'>
        <Link href='/'>
          <h1 className='font-bold text-2xl text-center'>
            Call of Duty: <span className='text-primary'>Zombies</span>
          </h1>
        </Link>
        <div className='hidden md:flex items-center gap-2 px-4 h-full font-semibold text-foreground/80'>
          <NavLink href='/black-ops-1' className='flex items-center h-fit rounded-md py-2 px-4 cursor-pointer hover:outline hover:outline-1 hover:outline-primary'>
            <span>Black Ops 1</span>
          </NavLink>
          <NavLink href='/black-ops-2' className='flex items-center h-fit rounded-md py-2 px-4 cursor-pointer hover:outline hover:outline-1 hover:outline-primary'>
            <span>Black Ops 2</span>
          </NavLink>
          <NavLink href='/black-ops-3' className='flex items-center h-fit rounded-md py-2 px-4 cursor-pointer hover:outline hover:outline-1 hover:outline-primary'>
            <span>Black Ops 3</span>
          </NavLink>
          <NavLink href='/black-ops-4' className='flex items-center h-fit rounded-md py-2 px-4 cursor-pointer hover:outline hover:outline-1 hover:outline-primary'>
            <span>Black Ops 4</span>
          </NavLink>
          <NavLink href='/black-ops-cold-war' className='flex items-center rounded-md h-fit py-2 px-4 cursor-pointer hover:outline hover:outline-1 hover:outline-primary'>
            <span>Black Ops Cold War</span>
          </NavLink>
          <ThemeToggle />
        </div>
        <Sidebar />
      </nav>
    </header>
  )
}
