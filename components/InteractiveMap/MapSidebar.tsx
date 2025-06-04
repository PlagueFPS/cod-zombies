"use client"
import type { MapMarker, MarkerCategory, MarkerType } from "@/types/InteractiveMap"
import type { MapId } from "@/map-configs"
import { useParams } from "next/navigation"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "../ui/sidebar"
import { capatilize } from "@/utils/functions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown, MapPin } from "lucide-react"
import { CustomLink } from "../CustomLink/CustomLink"
import { Switch } from "../ui/switch"
import { useMapSearchParams } from "@/hooks/useMapSearchParams"
import Image from "next/image"

interface IMapSidebar {
  availableMaps: MapId[]
  groups: Record<MarkerCategory, MarkerType[]>
  objectives: MapMarker[]
}

export default function MapSidebar({ groups, objectives, availableMaps }: IMapSidebar) {
  const { toggleParam, filterParams } = useMapSearchParams()
  const { id } = useParams()
  const currentMap = capatilize(String(id))

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
        { groups.general.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                { groups.general.map(type => (
                  <SidebarMenuItem key={ type } className="flex items-center bg-accent dark:bg-accent/25 rounded-md p-2">
                    <div className="flex items-center justify-center gap-1">
                      <MarkerFilterIcon type={ type } />
                      <span className="text-base font-medium">{ capatilize(type) }</span>
                    </div>
                    <Switch 
                      id={`${type}-filter`} 
                      defaultChecked
                      onCheckedChange={ () => handleCheckedChange(type) }
                      className="ml-auto cursor-pointer"
                    />
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        { groups.equipment.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Equipment</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                { groups.equipment.map(type => (
                  <SidebarMenuItem key={ type } className="flex items-center bg-accent dark:bg-accent/25 rounded-md p-2">
                    <div className="flex items-center justify-center gap-1">
                      <MarkerFilterIcon type={ type } />
                      <span className="text-base font-medium">{ capatilize(type) }</span>
                    </div>
                    <Switch 
                      id={`${type}-filter`} 
                      defaultChecked
                      onCheckedChange={ () => handleCheckedChange(type) }
                      className="ml-auto cursor-pointer"
                    />
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        { groups.upgrades.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Upgrades</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                { groups.upgrades.map(type => (
                  <SidebarMenuItem key={ type } className="flex items-center bg-accent dark:bg-accent/25 rounded-md p-2">
                    <div className="flex items-center justify-center gap-1">
                      <MarkerFilterIcon type={ type } />
                      <span className="text-base font-medium">{ capatilize(type) }</span>
                    </div>
                    <Switch 
                      id={`${type}-filter`} 
                      defaultChecked
                      onCheckedChange={ () => handleCheckedChange(type) }
                      className="ml-auto cursor-pointer"
                    />
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        { objectives.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Objectives</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                { objectives.map(objective => (
                  <SidebarMenuItem key={ objective.id } className="flex items-center bg-accent dark:bg-accent/25 rounded-md p-2">
                    <div className="flex items-center justify-center gap-1">
                      <MarkerFilterIcon type={ objective.type } objectiveId={ objective.id } />
                      <span className="text-base font-medium">{ objective.title }</span>
                    </div>
                    <Switch 
                      id={`${objective.id}-filter`} 
                      defaultChecked
                      onCheckedChange={ () => handleCheckedChange("objective") }
                      className="ml-auto cursor-pointer"
                    />
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        { groups.transportation.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Transportation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                { groups.transportation.map(type => (
                  <SidebarMenuItem key={ type } className="flex items-center bg-accent dark:bg-accent/25 rounded-md p-2">
                    <div className="flex items-center justify-center gap-1">
                      <MarkerFilterIcon type={ type } />
                      <span className="text-base font-medium">{ capatilize(type) }</span>
                    </div>
                    <Switch 
                      id={`${type}-filter`} 
                      defaultChecked
                      onCheckedChange={ () => handleCheckedChange(type) }
                      className="ml-auto cursor-pointer"
                    />
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
      </SidebarContent>
    </Sidebar>
  )
}

function MarkerFilterIcon({ type, objectiveId }: { type: MarkerType, objectiveId?: string }) {
  switch(type) {
    default: 
      return (
        <Image 
          unoptimized
          src={`/icons/${type}.webp`}
          height={ 128 }
          width={ 128 }
          alt={`${type} Image`}
          className="size-8"
        />
      )
    case 'label': 
      return <MapPin className="size-8 p-1" />
    case 'perks':
      return (
        <Image 
          unoptimized
          src={`/icons/juggernog.webp`}
          height={ 128 }
          width={ 128 }
          alt={`Stamin-Up Image`}
          className="size-8 p-1"
        />
      )
    case 'objective':
      return (
        <Image 
          unoptimized
          src={`/icons/${objectiveId}.webp`}
          height={ 128 }
          width={ 128 }
          alt={ objectiveId ? `${capatilize(objectiveId)} Image` : "" }
          className="size-8"
        />
      )
  }
}
