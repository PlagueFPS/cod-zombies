import React from 'react'
import BestiaryCardLoader from './BestiaryCardLoader'
import { MAP_LIMIT } from '@/utils/constants'

export default function BestiaryGridLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      { Array.from({ length: MAP_LIMIT }, (_, i) => (
        <BestiaryCardLoader key={ `bestiary-card-loader-${i}` } />
      ))}
    </div>
  )
}
