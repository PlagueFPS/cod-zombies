import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '../ui/skeleton';
import ImageLoader from './ImageLoader';

export default function BestiaryCardLoader() {
  return (
    <article className="max-h-[450px] h-full group outline-none">
      <Card className="h-full rounded-xl bg-background overflow-hidden pointer-events-none shadow-lg">
        <CardHeader className="relative overflow-hidden h-60 space-y-0 p-0">
          <div className="absolute z-20 top-2 right-2 flex items-center justify-center gap-1">
            <Skeleton className="h-5 w-16 badge-primary-gradient" />
            <Skeleton className="h-5 w-16 badge-primary-gradient" />
          </div>
          <ImageLoader className='w-full h-full aspect-square rounded-t-xl' />
          <div className="block absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <Skeleton className="absolute bottom-2 left-4 w-1/3 h-6" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-2 mt-2">
          <div className='space-y-2'>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
