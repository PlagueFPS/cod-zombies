import type { MapId } from "@/map-configs";
import { getMapConfig } from "@/data/interactive-map";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { CustomLink } from "../CustomLink/CustomLink";

interface IPreviewCard {
  mapId: MapId
  index: number
}

export default async function PreviewCard({ mapId, index }: IPreviewCard) {
  const map = await getMapConfig(mapId)

  return (
    <CustomLink 
      href={`/maps/${map.id}`} 
      aria-label={`View ${map.title} interactive map`}
      className="group"
    >
      <div className="flex flex-col items-start justify-center gap-4">
        <div className="flex justify-center items-center w-full overflow-hidden rounded-md">
          <Image 
            unoptimized
            src={`/previews/${map.id}-preview.webp`}
            width={ 640 }
            height={ 360 }
            alt={ `${map.title} Preview Image` }
            priority={ index === 0 }
            className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
          />
        </div>
        <div className="flex flex-col items-start justify-center">
          <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{ map.game }</Badge>
          <h3 className="text-xl font-bold group-hover:text-orange-800 group-hover:dark:text-orange-400 transition-colors">{ map.title }</h3>
        </div>
      </div>
    </CustomLink>
  )
}
