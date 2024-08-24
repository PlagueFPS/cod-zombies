import 'server-only'
import sharp from "sharp"

export const generateBlurDataURL = async (imageURL: string | URL | undefined) => {
  if (imageURL) {
    const response = await fetch(`https:${imageURL}?fm=jpg`, { cache: 'no-store' })
    if (!response.ok) {
      console.error(`Error fetching ${imageURL}`)
      return null
    }

    try {
      const buffer = await response.arrayBuffer()
      const resizedImageBuffer = await sharp(buffer).resize(10).toBuffer()
      const base64ImageData = resizedImageBuffer.toString('base64')
      return `data:image/jpeg;base64,${base64ImageData}`
    }
    catch(e) {
      console.error(`Error generating blurDataURL for: ${imageURL}`, e)
      return null
    }
    
  }
  
  return null
}