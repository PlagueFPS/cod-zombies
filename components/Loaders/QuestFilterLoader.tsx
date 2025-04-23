import { Button } from '../ui/button'
import { CirclePlus } from 'lucide-react'

export default function QuestFilterLoader() {
  return (
    <div className='-mt-4 flex gap-2 items-center w-full'>
      <Button
        variant='outline'
        size='sm'
        role='combobox'
        aria-expanded={ false }
        disabled
        aria-disabled
        className='gap-2 border-dashed'
      >
        <CirclePlus className='size-4 text-primary' />
        { "Map" }
      </Button>
    </div>
  )
}
