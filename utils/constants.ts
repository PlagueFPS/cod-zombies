export const SITE_TITLE = 'Call of Duty: Zombies'
export const SITE_DESCRIPTION = `Unlock the secrets of Call of Duty Zombies and 
explore our comprehensive guides to the most challenging and rewarding easter eggs
in the Call of Duty Zombies universe`
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

export const checkPriority = (slug: string): boolean => {
  return slug === 'forsaken' || slug === 'mauer-der-toten' || slug === 'firebase-z' || slug === 'die-maschine'
}