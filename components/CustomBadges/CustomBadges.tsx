import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Difficulty } from '@/types/FeaturedMap'
import type { ZombieType } from '@/types/Zombie'

interface CustomBadgeProps { 
  className?: string
}

export const DraftBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-draft-gradient', className)}>Draft</Badge>
export const ChangedBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-changed-gradient', className)}>Changed</Badge>
export const NewBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-new-gradient', className)}>New</Badge>
export const ComingSoonBadge = ({ className }: CustomBadgeProps) => <Badge className={cn('badge-changed-gradient', className)}>Coming Soon</Badge>
export const DifficultyBadge = ({ className, difficulty }: CustomBadgeProps & { difficulty: Difficulty }) => 
  <Badge className={cn({
    'badge-easy-gradient': difficulty === "Easy",
    'badge-medium-gradient': difficulty === "Medium",
    'badge-hard-gradient': difficulty === "Hard",
  }, className)}>{ difficulty }</Badge>
export const TypeBadge = ({ className, type }: CustomBadgeProps & { type: ZombieType }) => 
  <Badge className={cn({
    'badge-easy-gradient': type === "Normal",
    'badge-medium-gradient': type === "Special",
    'badge-elite-gradient': type === "Elite",
    'badge-hard-gradient': type === "Boss",
  }, className)}>{ type }</Badge>