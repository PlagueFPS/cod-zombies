import FeaturedImage from "@/components/FeaturedImage/FeaturedImage"
import { ChangedBadge, DraftBadge, NewBadge } from "@/components/CustomBadges/CustomBadges"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SideQuest } from "@/types/SideQuest"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { CustomLink } from "@/components/CustomLink/CustomLink"

interface QuestCardProps {
  quest: Omit<SideQuest, "content" | "updatedAt">
  isEnabled: boolean
}

export default function QuestCard({ quest: q, isEnabled }: QuestCardProps) {
  const priority = true

  return (
    <article className="max-h-[450px] h-full group outline-none">
      <CustomLink href={ `/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}` } aria-label={ `View Guide for ${q.title}` }>
        <div className='sr-only'>View Guide for { q.title }</div>
        <Card className="relative h-full group-hover:border-primary group-hover:scale-105 group-focus-visible:scale-105 group-focus-visible:border-primary cursor-pointer transition-transform overflow-hidden animate-fade-in">
          <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
            { q.isNew ? <NewBadge /> : null }
            { (isEnabled || IN_DEVELOPMENT) && q.isDraft ? <DraftBadge /> : null }
            { (isEnabled || IN_DEVELOPMENT) && q.isChanged ? <ChangedBadge /> : null }
            <Badge className='badge-primary-gradient'>
              { q.map.title }
            </Badge>
            <Badge className='badge-primary-gradient'>
              { q.game.title }
            </Badge>
          </div>
          <div className="absolute -top-10 left-0 right-0 bottom-0 z-10 flex items-center w-full h-full scale-[2.5] opacity-25 blur-2xl">
              <FeaturedImage 
                featuredImage={ q.image } 
                priority={ priority }
                quality={ 1 }
                sizes='272px' 
              />
          </div>
          <CardHeader className="flex gap-2 flex-grow">
            <div className='relative overflow-hidden h-full w-full rounded-md'>
                <FeaturedImage 
                  featuredImage={ q.image }
                  alt="Side Quest Image"
                  sizes='272px'
                  className='h-44 object-cover' 
                />
            </div>
            <div className='space-y-2'>
              <CardTitle className="group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ q.title }</CardTitle>
              <CardDescription className='text-foreground/85'>{ q.description }</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </CustomLink>
    </article>
  )
}
