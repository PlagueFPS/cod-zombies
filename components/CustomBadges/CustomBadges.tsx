import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CustomBadgeProps { 
  className?: string
}

export const DraftBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-draft-gradient', className)}>Draft</Badge>
export const ChangedBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-changed-gradient', className)}>Changed</Badge>
export const NewBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-new-gradient', className)}>New</Badge>
export const ComingSoonBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-changed-gradient', className)}>Coming Soon</Badge>