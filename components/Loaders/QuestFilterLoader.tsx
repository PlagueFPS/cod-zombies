import React from 'react'
import { Button } from '../ui/button'
import { ChevronsUpDown } from 'lucide-react'

interface IQuestFilterLoader {
  text?: string
}

export default function QuestFilterLoader({ text = "Filter by Game or Map" }: IQuestFilterLoader) {
  return (
    <Button 
      variant="outline" 
      className='w-[200px] justify-between animate-pulse' 
      role='combobox' 
      aria-expanded={ false }
      disabled
      aria-disabled
    >
      { text }
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )
}
