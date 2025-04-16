import React from 'react'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import GridSection from '../GridSection/GridSection'
import BestiaryFiltersLoader from './BestiaryFiltersLoader'
import GridLoader from './GridLoader'

export default function BestiaryPageLoader() {
  const links: { title: string, href: string }[] = [
    { title: 'Bestiary', href: `/bestiary` },
  ]

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="container flex flex-col gap-12 justify-center items-center">
        <Breadcrumbs links={ links } />
        <GridSection title="Bestiary">
          <p className="text-lg text-muted-foreground -mt-7 mb-2">
            Learn about the weaknesses, behavior, and strategies to defeat the undead horde.
          </p>
          <BestiaryFiltersLoader />
          <GridLoader />
        </GridSection>
      </div>
    </div>
  )
}
