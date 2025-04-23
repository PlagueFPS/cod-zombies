import BestiaryFilters from "@/components/BestiaryFilters/BestiaryFilters";
import BestiaryGrid from "@/components/BestiaryGrid/BestiaryGrid";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import GridSection from "@/components/GridSection/GridSection";
import BestiaryFiltersLoader from "@/components/Loaders/BestiaryFiltersLoader";
import GridLoader from "@/components/Loaders/GridLoader";
import { env } from "@/env";
import { GLOBAL_OG_PROPS } from "@/utils/constants";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Bestiary',
  description: 'Learn about the weaknesses, behavior, and strategies to defeat the undead horde in Call of Duty: Zombies.',
  openGraph: {
    ...GLOBAL_OG_PROPS.openGraph,
    title: 'Bestiary',
    description: 'Learn about the weaknesses, behavior, and strategies to defeat the undead horde in Call of Duty: Zombies.',
    url: '/bestiary'
  },
  twitter: {
    title: 'Bestiary',
    description: 'Learn about the weaknesses, behavior, and strategies to defeat the undead horde in Call of Duty: Zombies.',
    card: 'summary_large_image'
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary`,
  }
}

export default function BestiaryPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="container flex flex-col gap-6 justify-center items-center">
        <Breadcrumbs 
          links={[
            { title: 'Bestiary', href: '/bestiary' },
          ]}
        />
        <GridSection title="Bestiary">
          <p className="sm:text-lg text-muted-foreground -mt-6 mb-2">
            Learn about the weaknesses, behavior, and strategies to defeat the undead horde.
          </p>
          <Suspense fallback={<BestiaryFiltersLoader />}>
            <BestiaryFilters />
          </Suspense>
          <Suspense fallback={<GridLoader />}>
            <BestiaryGrid />
          </Suspense>
        </GridSection>
      </div>
    </div>
  )
}
