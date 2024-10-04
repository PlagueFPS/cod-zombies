import { Asset } from 'contentful'
import { headers } from 'next/headers'
import RichTextImage from './RichTextImage'

interface RichImageProps {
  asset: Asset<undefined, string> | undefined
  quality?: number
  className?: string
}

export default async function RichImage({ ...props }: RichImageProps) {
  const headerList = await headers()
  const accept = headerList.get('Accept') || ''
  const avif = accept.includes('image/avif')
  const webp = accept.includes('image/webp')

  return (
    <RichTextImage 
      {...props}
      avif={ avif }
      webp={ webp }
    />
  )
}
