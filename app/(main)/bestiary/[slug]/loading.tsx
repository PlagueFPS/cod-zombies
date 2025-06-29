import BestiaryBreadcrumbsLoader from '@/components/loaders/bestiary-breadcrumb-loader'
import ImageLoader from '@/components/loaders/image-loader'
import PrevOrNextCardLoader from '@/components/loaders/prev-or-next-card-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, BookOpen, Eye, Footprints, Gamepad2, Info, Map, Share2, Swords, Target, Zap } from 'lucide-react'

export default function ZombiePageLoader() {
  return (
    <article className="relative container mx-auto py-4 sm:py-6 px-3 sm:px-4">
      <div className="absolute -top-5 left-5 z-30 pl-4 xl:pl-0 flex w-full justify-center">
        <BestiaryBreadcrumbsLoader />
      </div>
      <Card className="mb-6 border-2 overflow-hidden bg-background pt-0">
        <div className="bg-accent dark:bg-accent/50 py-2 px-4 flex justify-between items-center">
          <Skeleton className='h-5.5 w-16 badge-medium-gradient dark:dark-badge-medium-gradient' />
          <Button 
            variant={"ghost"} 
            size={"icon"} 
            disabled 
            aria-disabled
            className="ml-auto text-muted-foreground mb-2 md:mb-0 animate-pulse" 
          >
            <span className="sr-only">Share</span>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <CardHeader>
          <Skeleton className='h-9 md:h-10 w-1/4' />
        </CardHeader>
        <CardContent>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image and Stats */}
            <div className="flex flex-col items-center">
              <ImageLoader className='h-full w-full border aspect-square mb-4 static' />
              <div className="w-full space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="size-5 text-orange-500" />
                      <span className="text-muted-foreground">First Appeared In</span>
                    </div>
                    <Skeleton className='h-5 w-28' />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="size-5 text-yellow-500" />
                      <span className="text-muted-foreground">Speed</span>
                    </div>
                    <Skeleton className='h-5 w-20' />
                  </div>
                  <Progress value={ 50 } className="h-2 mt-1 animate-pulse" />
                </div>
              </div>
            </div>
            {/* Description and Weaknesses */}
            <div className="md:col-span-2 space-y-6">
              <div className='space-y-2'>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <BookOpen className="size-5 text-foreground" />
                  Description
                </h3>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-1/2' />
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Map className="size-5 text-blue-500" />
                  Map Appearances
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className='h-6 w-24 badge-changed-gradient dark:dark-badge-changed-gradient' />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Gamepad2 className="size-5 text-orange-500" />
                  Game Appearances
                </h3>
                <div className="flex flex-wrap items-center gap-2">                 
                  <Skeleton className='h-6 w-24 badge-primary-gradient dark:dark-badge-primary-gradient' />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <Target className="size-5 text-red-500" />
                  Weak Points
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className='h-6 w-24 badge-hard-gradient dark:dark-badge-hard-gradient' />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-5 text-orange-800 dark:text-orange-300" />
                  Elemental Weaknesses
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className='h-6 w-24' />
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attacks Section */}
        <Card className="bg-background">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Swords className="size-6 text-primary" />
              <h3 className="text-xl font-bold">Attacks</h3>
            </div>
            <div className="space-y-4">
              { Array.from({ length: 3 }, (_, num) => (
                <div key={ `attack-${num}` } className="p-3 border rounded-lg">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <Skeleton className='h-6 w-36' />
                    <div className="flex flex-wrap gap-1">
                      <Skeleton className='h-6 w-24' />
                    </div>
                  </div>
                  <CardDescription className='space-y-2'>
                    <Skeleton className='h-4 w-full '/>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-1/2' />
                  </CardDescription>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Spawn Behavior Section */}
        <Card className="bg-background">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Footprints className="size-6 text-purple-600 dark:text-purple-300" />
              <h3 className="text-xl font-bold">Spawn Behavior</h3>
            </div>
            <CardDescription className='space-y-2'>
              <Skeleton className='h-4 w-full '/>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-1/2' />
            </CardDescription>
          </CardContent>
        </Card>
        {/* Combat Strategy Section */}
        <Card className="bg-background">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Info className="size-6 text-green-600 dark:text-green-300" />
              <h3 className="text-xl font-bold">Combat Strategy</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <Skeleton className='h-4 w-full '/>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </CardContent>
        </Card>
      </section>
      <section className='flex flex-row justify-center items-center w-full mt-8'>
        <div className='flex flex-col lg:flex-row w-full justify-center items-center px-3 mx-auto xl:px-0 xl:ml-auto xl:mr-0 gap-8'>
          <PrevOrNextCardLoader prev type='zombie' />
          <PrevOrNextCardLoader type='zombie' />
        </div>
      </section>
    </article>
  )
}
