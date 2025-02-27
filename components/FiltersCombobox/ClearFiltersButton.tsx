import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '../ui/button'
import { Trash2 } from 'lucide-react'

interface IClearFiltersButton extends ButtonProps {}

export default function ClearFiltersButton({ className, ...props }: IClearFiltersButton) {
  return (
    <Button
      variant="outline"
      size={"sm"}
      className={cn("gap-2 border-red-600 border-dashed text-red-900 dark:text-red-300", className)}
      {...props}
    >
    <Trash2 className="size-4 text-red-800 dark:text-red-500" />
    Clear
  </Button>
  )
}
