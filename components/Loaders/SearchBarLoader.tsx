import { Button } from '../ui/button'
import { Search } from 'lucide-react'

export default function SearchBarLoader() {
  return (
    <div className='flex justify-center items-center w-fit'>
      <Button type="button" size="sm" variant="outline" disabled className="relative hidden sm:flex gap-x-2 w-64 text-muted-foreground text-xs rounded-sm animate-pulse">
        <Search className="size-5" />
        <span className="text-sm">
          Search Maps
        </span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 px-1.5 rounded bg-muted text-muted-foreground font-medium opacity-100">
          <span className="text-xs">Ctrl+K</span>
        </kbd>
      </Button>
      <Button type="button" size="icon" variant="ghost" disabled className="flex sm:hidden text-muted-foreground animate-pulse">
        <Search className="size-6" />
      </Button>
    </div>
  )
}
