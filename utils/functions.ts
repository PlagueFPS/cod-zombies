import { timingSafeEqual } from "crypto"

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

export const authorizedRequest = (secret: string | null, validSecret: string) => {
  const encoder = new TextEncoder()
  const secretBuffer = encoder.encode(secret || '')
  const validSecretBuffer = encoder.encode(validSecret)
  return timingSafeEqual(secretBuffer, validSecretBuffer)
}