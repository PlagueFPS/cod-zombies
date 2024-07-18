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