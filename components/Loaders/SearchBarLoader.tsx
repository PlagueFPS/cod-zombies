import { Button } from '../ui/button'
import { Search } from 'lucide-react'

export default function SearchBarLoader() {
  return (
    <div className='flex justify-center items-center w-fit'>
      <Button 
        type="button" 
        variant="outline"
        aria-disabled
        className=" hidden sm:flex gap-8 text-foreground/70 w-fit pointer-events-none sm:animate-pulse"
      >
        Search for maps...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl+K</span>
        </kbd>
      </Button>
      <Button 
        type="button" 
        variant="outline"
        aria-disabled
        className="flex sm:hidden gap-3 text-foreground/70 w-fit pointer-events-none animate-pulse sm:animate-none"
      >
        <Search className="h-5 w-5" />
        Search
      </Button>
    </div>
  )
}
