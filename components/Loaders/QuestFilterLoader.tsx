import { Button } from '../ui/button'
import { CirclePlus } from 'lucide-react'

export default function QuestFilterLoader() {
  return (
    <div className='-mt-4 flex gap-2 items-center w-full'>
      { ["Game", "Map"].map((filter, index) => (
        <Button
          key={ `quest-${filter}-${index}` }
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={ false }
          disabled
          aria-disabled
          className='gap-2 border-dashed border-primary/25'
        >
          <CirclePlus className='size-4 text-primary' />
          { filter }
        </Button>
      ))}
    </div>
  )
}
