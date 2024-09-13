import { Map } from "@/types/Map"

interface MapOrder {
  [key: string]: number
}

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

export const checkParams = (param: string | string[] | undefined) => {
  return (param && !Array.isArray(param)) ? param : null
}

export const slugify = (text: string) => {
  return text.toLowerCase()
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/\//g, '-') // Replace slashes with hyphens
    .replace(/&/g, "and") // Replaces "&" symbol with the text "and"
    
}

export const getYouTubeVideoID = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const sortMaps = (x: Map, y: Map) => {
  const mapOrder: MapOrder = {
    "ascension": 0,
    "call-of-the-dead": 1,
    "shangri-la": 2,
    "moon": 3,
    "tranzit": 4,
    "die-rise": 5,
    "mob-of-the-dead": 6,
    "buried": 7,
    "origins": 8,
    "shadows-of-evil": 9,
    "the-giant": 10,
    "der-eisendrache": 11,
    "zetsubou-no-shima": 12,
    "gorod-krovi": 13,
    "revelations": 14,
    "voyage-of-despair": 15,
    "ix": 16,
    "blood-of-the-dead": 17,
    "classified": 18,
    "dead-of-the-night": 19,
    "ancient-evil": 20,
    "alpha-omega": 21,
    "tag-der-toten": 22,
    "die-maschine": 23,
    "firebase-z": 24,
    "mauer-der-toten": 25,
    "forsaken": 26,
    "terminus": 27,
    "liberty-falls": 28,
  }

  let a = mapOrder[x.fields.slug]
  let b = mapOrder[y.fields.slug]
  return a === b ? 0 : a < b ? 1 : -1
}