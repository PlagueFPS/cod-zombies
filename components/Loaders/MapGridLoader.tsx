import { MAP_LIMIT } from "@/utils/constants";
import { Card } from "../ui/card";

export default function MapGridLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      {[...Array(MAP_LIMIT).keys()].map(i => (
        <Card key={ i } className="h-[400px] w-[322px] bg-secondary animate-pulse" />
      ))}
    </div>
  )
}
