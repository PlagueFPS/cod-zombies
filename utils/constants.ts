export const SITE_TITLE = 'Call of Duty: Zombies Guides'
export const SITE_DESCRIPTION = `Unlock the secrets of Call of Duty Zombies and 
explore our comprehensive guides to the most challenging and rewarding easter eggs
in the Call of Duty Zombies universe`
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

export const isPriority = (mapIndex: number, totalMaps: number) => {
  if (mapIndex < totalMaps - (totalMaps - 4)) return true
  else return false
}

export const capatilize = (text: string) => {
  return text
    .replace(/-/g, " ") // Replace hyphens with spaces
    .split(" ") // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" ") // Join the words back into a single string
}