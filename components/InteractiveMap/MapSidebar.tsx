"use client"
import type { MapConfig, MarkerType } from "@/types/InteractiveMap"
import type { MapId } from "@/map-configs"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "../ui/sidebar"
import { capatilize } from "@/utils/functions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { CustomLink } from "../CustomLink/CustomLink"
import { Switch } from "../ui/switch"
import { useMapSearchParams } from "@/hooks/useMapSearchParams"

interface IMapSidebar {
  mapConfig: MapConfig
  availableMaps: MapId[]
}

export default function MapSidebar({ mapConfig, availableMaps }: IMapSidebar) {
  const { toggleParam, filterParams } = useMapSearchParams()
  const { id } = useParams()
  const currentMap = capatilize(String(id))
  const uniqueMarkerTypes = useMemo(() => 
    Array.from(new Set(mapConfig.markers.map(marker => marker.type))
  ), [mapConfig.markers])

  const handleCheckedChange = (type: MarkerType) => {
    toggleParam("filtered", type, filterParams)
  }

  return (
    <Sidebar side="left" collapsible="offcanvas" className="z-400 mt-16">
      <SidebarHeader className="bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  { currentMap }
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-400">
                { availableMaps.map(map => (
                  <DropdownMenuItem key={ map }>
                    <CustomLink href={`/maps/${map}`} aria-label={`Go to ${capatilize(map)} interacitve map page`} className="w-full">
                      { capatilize(map) }
                    </CustomLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarTrigger className="ml-auto" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              { uniqueMarkerTypes.map(type => (
                <SidebarMenuItem key={ type }>
                  <span>{ capatilize(type) }</span>
                  <Switch 
                    id={`${type}-filter`} 
                    defaultChecked
                    onCheckedChange={ () => handleCheckedChange(type) }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
