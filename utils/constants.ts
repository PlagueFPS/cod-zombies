import type { GameCategory } from "@/types/GameCategory"

export const SITE_TITLE = 'Call of Duty: Zombies'
export const SITE_DESCRIPTION = `Unlock the secrets of Call of Duty Zombies and 
explore our comprehensive guides to the most challenging and rewarding easter eggs
in the Call of Duty Zombies universe`
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
export const gameList = [
  {
    id: 'black-ops-1',
    name: 'Black Ops 1'
  },
  {
    id: 'black-ops-2',
    name: 'Black Ops 2'
  },
  {
    id: 'black-ops-3',
    name: 'Black Ops 3'
  },
  {
    id: 'black-ops-4',
    name: 'Black Ops 4'
  },
  {
    id: 'black-ops-cold-war',
    name: 'Black Ops Cold War'
  },
  // {
  //   id: 'black-ops-6',
  //   name: 'Black Ops 6'
  // },
]
export const validateSearchParams = (rawCategory: string | string[] | undefined) => {
  let category: GameCategory | undefined = undefined

  switch(rawCategory){
    default:
      category = undefined
      break
    case 'black-ops-1':
      category = 'black-ops-1'
      break
    case 'black-ops-2':
      category = 'black-ops-2'
      break
    case 'black-ops-3':
      category = 'black-ops-3'
      break
    case 'black-ops-4':
      category = 'black-ops-4'
      break
    case 'black-ops-cold-war':
      category = 'black-ops-cold-war'
      break
    // case 'black-ops-6':
    //   category = 'black-ops-6'
  }

  return { category }
}