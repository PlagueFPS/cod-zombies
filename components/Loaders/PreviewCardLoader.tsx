import React from 'react'
import ImageLoader from './ImageLoader'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'

export default function PreviewCardLoader() {
  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <div className="flex justify-center items-center w-full overflow-hidden rounded-md">
        <ImageLoader />
      </div>
      <div className="flex flex-col items-start justify-center">
        <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient"></Badge>
        <Skeleton className='h-5 w-10' />
      </div>
    </div>
  )
}
