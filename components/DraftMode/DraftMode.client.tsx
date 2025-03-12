"use client"
import { toggleDraftMode } from '@/data/actions'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface IDraftModeButton {
  draftMode: boolean
}

export default function DraftModeButton({ draftMode }: IDraftModeButton) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Tooltip delayDuration={ 200 }>
        <TooltipTrigger className='fixed bottom-8 right-16 flex items-center justify-center w-fit'>
          <Button 
            variant={"outline"}
            size={"icon"}
            onClick={async () => await toggleDraftMode({ pathname })}
            title={draftMode ? "Disable Draft Mode" : "Enable Draft Mode"}
            aria-label={draftMode ? "Disable Draft Mode" : "Enable Draft Mode"}
            className='rounded-full size-10 p-1.5'
            asChild
          >
            { draftMode ? <EyeOff /> : <Eye /> }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          { draftMode ? "Disable Draft Mode" : "Enable Draft Mode" }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
