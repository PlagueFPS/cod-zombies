import { MAP_LIMIT } from "./constants"
import { getMaps } from "./contentful-utils"

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

export const getSkipAndPage = async (unvalidatedPage: string | string[] | undefined) => {
  const maps = await getMaps()
  const totalPages = Math.ceil(maps.total / MAP_LIMIT)
  let page = unvalidatedPage ? +unvalidatedPage : 1
  if (page > totalPages) page = totalPages
  else if (page <= 1 || isNaN(page)) page = 1
  const skip = page <= 1 ? 0 : (MAP_LIMIT * page) - MAP_LIMIT

  return {
    currentPage: page,
    skip,
    totalPages
  }
}