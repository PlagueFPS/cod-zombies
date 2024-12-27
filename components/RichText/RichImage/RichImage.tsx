import type { Asset } from "contentful"
import type { ImageProps } from "@/types/Image"
import { createImageDTO } from "@/utils/contentful-utils"
import FeaturedImage from "@/components/FeaturedImage/FeaturedImage"

interface RichImageProps {
  asset: Asset<undefined, string>
}

export default function RichImage({ asset }: RichImageProps) {
  const imageProps: ImageProps = {
    featuredImage: createImageDTO(asset),
    sizes: "(max-width: 828px) calc(100vw - 16px), 776px",
  } 
  
  return (
    <div className="relative w-full mt-8">
      <div className="absolute top-4 left-0 right-0 z-10 mx-auto w-full opacity-35 blur-2xl">
        <FeaturedImage 
          {...imageProps} 
          quality={ 1 } 
          description={ asset.fields.description } 
          className="rounded-lg" 
        />
      </div>
      <div className="relative z-20">
        <FeaturedImage 
          {...imageProps} 
          quality={ 100 } 
          description={ asset.fields.description } 
          className="rounded-lg" 
        />
      </div>
    </div>
  )
}
