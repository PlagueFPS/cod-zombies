import type { Document } from "@contentful/rich-text-types"
import type { Date } from "./FeaturedMap"

export interface Zombie {
  id: string
  name: string
  slug: string
  description: string
  type: ZombieType
  updatedAt: Date
  image: {
    url: string | undefined
    width: number | undefined
    height: number | undefined
  }
  games: {
    title: string
    slug: string
  }[]
  maps: {
    title: string
    slug: string
  }[]
  elementalWeakness?: {
    id: string
    title: string
    slug: string
    image: {
      url: string | undefined
      width: number | undefined
      height: number | undefined
    }
  }[]
  weakPoints: string[]
  speed: "Fast" | "Medium" | "Slow"
  spawnBehavior: string
  attacks: string[]
  isNew: boolean
  isChanged: boolean
  isDraft: boolean
  combatStrategy: Document
}

export interface MinifiedZombie extends Omit<Zombie, "combatStrategy" | "elementalWeakness" | "weakPoints" | "speed" | "attacks" | "spawnBehavior" | "updatedAt"> {}

export type ZombieType = "Boss" | "Special" | "Elite" | "Normal"