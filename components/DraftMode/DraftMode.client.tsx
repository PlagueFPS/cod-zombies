"use client"
import { toggleDraftMode } from '@/data/actions'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

interface IDraftModeButton {
  draftMode: boolean
}

export default function DraftModeButton({ draftMode }: IDraftModeButton) {
  const pathname = usePathname()

  return (
    <Button 
      variant={"outline"}
      size={"sm"}
      onClick={async () => await toggleDraftMode({ pathname })}
    >
      { draftMode ? "Disable Draft Mode" : "Enable Draft Mode" }
    </Button>
  )
}
