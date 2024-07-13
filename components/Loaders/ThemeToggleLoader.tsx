import React from 'react'
import { Button } from '../ui/button'
import { Monitor, Moon, Sun } from 'lucide-react'

export default function ThemeToggleLoader() {
  return (
    <div className="flex w-fit rounded-full border p-0.5" role="radiogroup">
      <Button 
        variant="outline" 
        size="icon" 
        role="radio" 
        type="button" 
        title="Light" 
        aria-label="Switch to light theme"
        className="bg-transparent text-muted-foreground w-8 h-8 rounded-full border-none"
      >
        <Sun className="h-4 w-4 transition-all" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        role="radio" 
        type="button" 
        title="System" 
        aria-label="Switch to system theme"
        className="bg-transparent text-muted-foreground w-8 h-8 rounded-full border-none"
      >
        <Monitor className="h-4 w-4 transition-all" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        role="radio" 
        type="button" 
        title="Dark" 
        aria-label="Switch to dark theme" 
        className="bg-transparent text-muted-foreground w-8 h-8 rounded-full border-none"
      >
        <Moon className="h-4 w-4 transition-all" />
      </Button>
    </div>
  )
}
