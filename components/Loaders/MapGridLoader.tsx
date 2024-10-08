import { MAP_LIMIT } from "@/utils/constants";
import MapCardLoader from "./MapCardLoader";

export default function MapGridLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      {[...Array(MAP_LIMIT).keys()].map(i => (
        <MapCardLoader key={ `map-card-loader-${i}` } />
      ))}
    </div>
  )
}
