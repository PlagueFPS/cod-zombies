import type { ImageProps } from "@/types/Image"
import { headers } from "next/headers"
import BackupImage from "./BackupImage"

export default async function ContentfulImage({ ...props }: ImageProps) {
  const headerList = await headers()
  const accept = headerList.get('Accept') || ''
  
  return (
    <BackupImage 
      {...props}
      acceptHeader={ accept }
    />
  )
}
