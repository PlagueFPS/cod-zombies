import { MinifiedZombie } from "@/types/Zombie"
import { CustomLink } from "../CustomLink/CustomLink"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChangedBadge, DraftBadge, NewBadge, TypeBadge } from "../CustomBadges/CustomBadges"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { Badge } from "../ui/badge"
import FeaturedImage from "../FeaturedImage/FeaturedImage"

interface IBestiaryCard {
  zombie: MinifiedZombie
  zombieIndex: number
  draftMode: boolean
}

export default function BestiaryCard({ zombie, zombieIndex, draftMode }: IBestiaryCard) {
  const priority = zombieIndex === 0
  const alt = `${zombie.name} Image`


  return (
    <article className="max-h-[450px] h-full group outline-none">
      <CustomLink href={ `/bestiary/${zombie.slug}` } aria-label={ `View details for ${zombie.name}` }>
        <Card className={`
          relative h-full group-hover:border-primary group-hover:scale-105 
          group-focus-visible:scale-105 group-focus-visible:border-primary 
          cursor-pointer transition-transform overflow-hidden animate-fade-in 
          shadow-xl dark:shadow-none`}
        >
          <div className='absolute top-2 right-2 z-20 w-fit flex items-center justify-center gap-1'>
            { zombie.isNew ? <NewBadge /> : null }
            { (draftMode || IN_DEVELOPMENT) && zombie.isDraft ? <DraftBadge /> : null }
            { (draftMode || IN_DEVELOPMENT) && zombie.isChanged ? <ChangedBadge /> : null }
            <TypeBadge type={ zombie.type } />
            <Badge className='badge-primary-gradient'>
              { zombie.games[0].title }
            </Badge>
          </div>
          <div className="hidden dark:flex absolute inset-0 z-10 items-center w-full h-full opacity-25 blur-2xl">
            <FeaturedImage 
              featuredImage={ zombie.image } 
              priority={ priority } 
              quality={ 1 }
              sizes='32px'
              className='aspect-square scale-150'
            />
          </div>
          <CardHeader className="flex gap-2 flex-grow">
            <div className='relative overflow-hidden h-full w-full rounded-md'>
              <FeaturedImage 
                featuredImage={ zombie.image } 
                priority={ priority }
                alt={ alt }
                sizes='272px'
                className="h-44 object-cover object-top"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">{ zombie.name }</CardTitle>
              <CardDescription className="text-foreground/85">{ zombie.description }</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </CustomLink>
    </article>
  )
}