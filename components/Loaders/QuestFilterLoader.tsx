import React from 'react'
import { Button } from '../ui/button'
import { ChevronsUpDown } from 'lucide-react'

export default function QuestFilterLoader() {
  return (
    <Button 
      variant="outline" 
      className='w-[200px] justify-between animate-pulse' 
      role='combobox' 
      aria-expanded={ false }
      disabled
      aria-disabled
    >
      Filter by Game or Map
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )
}
