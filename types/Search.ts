export interface SearchEntry {
  id: string
  slug: string
  title: string
}

export interface MapSearch extends SearchEntry {
  game: {
    title: string
    slug: string
  }
}

export interface QuestSearch extends MapSearch {
  map: {
    title: string
    slug: string
  }
}