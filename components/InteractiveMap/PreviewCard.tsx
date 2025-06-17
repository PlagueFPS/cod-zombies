import type { MapId } from "@/map-configs";
import { getMapConfig } from "@/data/interactive-map";
import { Badge } from "../ui/badge";
import { CustomLink } from "../CustomLink/CustomLink";
import PreviewCardImage from "./PreviewCardImage";

interface IPreviewCard {
  mapId: MapId
  index: number
}

export default async function PreviewCard({ mapId, index }: IPreviewCard) {
  const { data: map, error } = await getMapConfig(mapId)
  if (error) return null

  return (
    <CustomLink 
      href={`/maps/${map.id}`} 
      aria-label={`View ${map.title} interactive map`}
      className="group"
    >
      <div className="flex flex-col items-start justify-center gap-4">
        <div className="flex justify-center items-center w-full overflow-hidden rounded-md shadow-xl dark:shadow-none">
          <PreviewCardImage mapId={ mapId } title={ map.title } priority={ index === 0 } />
        </div>
        <div className="flex flex-col items-start justify-center">
          <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{ map.game }</Badge>
          <h3 className="text-xl font-bold group-hover:text-orange-600 group-hover:dark:text-orange-400 transition-colors">{ map.title }</h3>
        </div>
      </div>
    </CustomLink>
  )
}
