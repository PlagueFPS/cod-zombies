import type { ImageProps } from "@/types/Image"
import { headers } from "next/headers"
import BackupImage from "./BackupImage"

interface ContentfulImageProps extends ImageProps {
  loadingFallback?: React.JSX.Element
}

export default async function ContentfulImage({ loadingFallback, ...props }: ContentfulImageProps) {
  const headerList = await headers()
  const accept = headerList.get('Accept') || ''
  
  return (
    <BackupImage 
      {...props}
      acceptHeader={ accept }
      loadingFallback={ loadingFallback }
    />
  )
}
