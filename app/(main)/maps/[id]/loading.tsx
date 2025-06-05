import InteractiveMapLoader from "@/components/Loaders/InteractiveMapLoader";
import SidebarLoader from "@/components/Loaders/SidebarLoader";

export default function InteracitveMapLoading() {
  return (
    <div className="flex">
      <SidebarLoader />
      <InteractiveMapLoader />
    </div>
  )
}
