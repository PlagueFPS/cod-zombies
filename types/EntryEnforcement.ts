export type EntryStatus = "Coming Soon" | "Published"
export type EntryType = "mainQuest" | "sideQuest" | "game" | "zombie"
/** Valid content type slugs for Contentful webhook endpoints */
export type AllowedSlugs = 'maps'| 'side-quests' | 'zombies'  | 'legal'  | 'games' 