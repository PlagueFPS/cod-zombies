import { Button } from '../ui/button'
import { Sun } from 'lucide-react'

export default function ThemeToggleLoader() {
  return (
    <div className="flex w-fit p-0.5">
      <Button 
        variant="outline" 
        size="icon" 
        type="button" 
        aria-label="Toggle Theme"
        title="Toggle Theme"
        disabled
        aria-disabled 
        className="bg-transparent text-muted-foreground size-8 rounded-full border-none"
      >
        <Sun className="size-4 transition-all" />
      </Button>
    </div>
  )
}
