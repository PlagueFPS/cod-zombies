import { FeaturedMapWithoutBody } from "@/types/FeaturedMap"
import { SideQuest } from "@/types/SideQuest"
import { TypeGuards } from "@/utils/functions"
import { CustomLink } from "../CustomLink/CustomLink"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChangedBadge, ComingSoonBadge, DifficultyBadge, DraftBadge, NewBadge } from "../CustomBadges/CustomBadges"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { Badge } from "../ui/badge"
import FeaturedImage from "../FeaturedImage/FeaturedImage"

interface IQuestPreviewCard {
  quest: Omit<FeaturedMapWithoutBody, "updatedAt"> | Omit<SideQuest, "content" | "updatedAt">
  questIndex: number
  draftMode: boolean
}

export default function QuestPreviewCard({ quest, questIndex, draftMode }: IQuestPreviewCard) {
  const priority = questIndex === 0
  const alt = `${quest.title} map image`
  const isComingSoon = TypeGuards.hasProperty(quest, "isComingSoon") && quest.isComingSoon
  
  const resolveHref = () => {
    if (TypeGuards.hasProperty(quest, "isComingSoon")) {
      return quest.isComingSoon ? "#" : `/${quest.game.slug}/${quest.slug}`
    } 

    if (TypeGuards.hasProperty(quest, "map")) {
      return `/side-quests/${quest.game.slug}/${quest.map.slug}/${quest.slug}`
    }

    return '#'
  }

  return (
    <article className={cn("max-h-110 h-full group outline-hidden", {
      'pointer-events-none opacity-50': isComingSoon
    })}>
      <CustomLink 
        href={ resolveHref() } 
        aria-label={ `View Guide for ${quest.title}` }
        aria-disabled={ isComingSoon }
      >
        <Card className={`
          relative h-full group-hover:border-primary group-hover:scale-105 
          group-focus-visible:scale-105 group-focus-visible:border-primary 
          cursor-pointer transition-transform overflow-hidden animate-fade-in 
          shadow-xl dark:shadow-none`}
        >
          <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
            { isComingSoon ? <ComingSoonBadge /> : quest.isNew ? <NewBadge /> : null }
            { (draftMode || IN_DEVELOPMENT) && quest.isDraft ? <DraftBadge /> : null }
            { (draftMode || IN_DEVELOPMENT) && quest.isChanged ? <ChangedBadge /> : null }
            { TypeGuards.hasProperty(quest, "difficulty") ? (
                <>
                  { quest.difficulty && <DifficultyBadge difficulty={ quest.difficulty } /> }
                </>
              ) :
              (
                <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>
                  { quest.map.title }
                </Badge>
              )
            }
            <Badge className='badge-primary-gradient dark:dark-badge-primary-gradient'>
              { quest.game.title }
            </Badge>
          </div>
          <div className="hidden dark:flex absolute inset-0 z-10 items-center w-full h-full opacity-25 blur-2xl">
            <FeaturedImage 
              featuredImage={ quest.image } 
              priority={ priority } 
              quality={ 1 }
              sizes='32px'
              className='aspect-square scale-150'
            />
          </div>
          <CardHeader className="flex flex-col gap-2">
            <div className='relative overflow-hidden h-full w-full'>
              <FeaturedImage 
                featuredImage={ quest.image } 
                priority={ priority }
                alt={ alt }
                sizes='272px'
                className="h-44 object-cover rounded-md"
              />
            </div>
            <CardTitle className="text-xl group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ quest.title }</CardTitle>
            <CardDescription className="text-foreground/85">{ quest.description }</CardDescription>
          </CardHeader>
        </Card>
      </CustomLink>
    </article>
  )
}
