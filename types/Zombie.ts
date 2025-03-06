import { Date } from "./FeaturedMap"

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
}

export type ZombieType = "Boss" | "Special" | "Elite" | "Normal"