import React from 'react'
import { Button } from '../ui/button'
import { Search } from 'lucide-react'

export default function SearchBarLoader() {
  return (
    <div className='flex justify-center items-center w-1/2'>
      <Button variant="outline" size="icon" className="sm:hidden mr-2 pointer-events-none animate-pulse sm:animate-none">
        <Search size={ 20 } />
      </Button>
      <Button variant="outline" className="hidden sm:flex gap-8 text-foreground/70 pointer-events-none sm:animate-pulse">
        Search for maps...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl+K</span>
        </kbd>
      </Button>
    </div>
  )
}
