import { FeaturedMapWithoutBody } from "./FeaturedMap"
import { SideQuest } from "./SideQuest"

export type FilteredQuests = (Omit<FeaturedMapWithoutBody, "updatedAt"> | Omit<SideQuest, "updatedAt" | "content">)[]