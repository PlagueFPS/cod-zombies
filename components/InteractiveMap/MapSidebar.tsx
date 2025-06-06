"use client"
import type { MapMarker, MarkerCategory, MarkerType } from "@/types/InteractiveMap"
import type { MapId } from "@/map-configs"
import { useParams, useRouter } from "next/navigation"
import { capatilize } from "@/utils/functions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown, MapPin, PanelLeftOpenIcon } from "lucide-react"
import { CustomLink } from "../CustomLink/CustomLink"
import { Switch } from "../ui/switch"
import { useMapSearchParams } from "@/hooks/useMapSearchParams"
import Image from "next/image"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Separator } from "../ui/separator"
import Discord from "@/SVGs/DiscordSVG"
import Reddit from "@/SVGs/Reddit"
import X from "@/SVGs/XSVG"
import ExternalLink from "../ExternalLink/ExternalLink"
import { cn } from "@/lib/utils"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
} from "../ui/sidebar"
import ShareButton from "../ShareButton/ShareButton"
import { env } from "@/env"
import { useState } from "react"

interface IMapSidebar {
  availableMaps: MapId[]
  groups: Record<MarkerCategory, MarkerType[]>
  objectives: MapMarker[]
  uniqueMarkerTypes: MarkerType[]
}

export default function MapSidebar({ groups, objectives, availableMaps, uniqueMarkerTypes }: IMapSidebar) {
  const router = useRouter()
  const { toggleParam, filterParams, searchParams, clearParam } = useMapSearchParams()
  const { id } = useParams()
  const [toggle, setToggle] = useState<"All" | "None">("None")
  const currentMap = capatilize(String(id))

  const handleCheckedChange = (type: string) => {
    toggleParam("filtered", type, filterParams)
  }

  const handleClick = (map: string) => {
    router.push(`/maps/${map}`)
  }

  const createShareableURL = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("filtered")

    filterParams.forEach(filter => params.append("filtered", filter))

    if (params.size > 0) return `${env.NEXT_PUBLIC_WEBSITE_URL}/maps/${id}?${params.toString()}`
    else return `${env.NEXT_PUBLIC_WEBSITE_URL}/maps/${id}`
  }

  const toggleFilters = () => {
    if (toggle === "All") {
      setToggle("None")
      return clearParam("filtered")
    }

    const newValues: string[] = []

    objectives.forEach(objective => newValues.push(objective.id))
    uniqueMarkerTypes.forEach(type => {
      if (type === "objective") return
      newValues.push(type)
    })

    toggleParam("filtered", newValues, filterParams)
    setToggle("All")
  }

  return (
    <Sidebar side="left" collapsible="offcanvas" className="z-900 mt-16">
      <SidebarHeader className="bg-background border-b">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="border bg-input/30 border-input hover:bg-input/50 cursor-pointer">
                  <span className="font-semibold tracking-tight">{ currentMap }</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-900">
                { availableMaps.map(map => (
                  <DropdownMenuItem key={ map } className={cn({'pointer-events-none': map === id })} onClick={() => handleClick(map) }>
                    <span className={cn({'text-muted-foreground': map === id })}>{ capatilize(map) }</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarTrigger className="ml-auto" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-background [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-700">
        <SidebarMenu>
          <SidebarMenuItem className="px-8 mt-2">
            <SidebarMenuButton 
              onClick={ toggleFilters }
              className="border bg-accent/30 cursor-pointer justify-center"
            >
              <span className="tracking-wide">Toggle Filters</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        { groups.general.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover:bg-accent/50 cursor-pointer mb-2">
                  General
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
                          defaultChecked={ !filterParams.includes(type) }
                          onCheckedChange={ () => handleCheckedChange(type) }
                          checked={ !filterParams.includes(type) }
                          className="ml-auto cursor-pointer"
                        />
                    </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        { groups.equipment.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover:bg-accent/50 cursor-pointer mb-2">
                  Equipment
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
                          defaultChecked={ !filterParams.includes(type) }
                          onCheckedChange={ () => handleCheckedChange(type) }
                          checked={ !filterParams.includes(type) }
                          className="ml-auto cursor-pointer"
                        />
                    </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        { groups.upgrades.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover:bg-accent/50 cursor-pointer mb-2">
                  Upgrades
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
                          defaultChecked={ !filterParams.includes(type) }
                          onCheckedChange={ () => handleCheckedChange(type) }
                          checked={ !filterParams.includes(type) }
                          className="ml-auto cursor-pointer"
                        />
                    </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        { objectives.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover:bg-accent/50 cursor-pointer mb-2">
                  Objectives
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
                          defaultChecked={ !filterParams.includes(objective.id) }
                          onCheckedChange={ () => handleCheckedChange(objective.id) }
                          checked={ !filterParams.includes(objective.id) }
                          className="ml-auto cursor-pointer"
                        />
                    </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        { groups.transportation.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover:bg-accent/50 cursor-pointer mb-2">
                  Transportation
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
                          defaultChecked={ !filterParams.includes(type) }
                          onCheckedChange={ () => handleCheckedChange(type) }
                          checked={ !filterParams.includes(type) }
                          className="ml-auto cursor-pointer"
                        />
                    </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>
      <SidebarFooter className="mb-16 bg-background border-t">
        <SidebarMenu className="py-4">
          <SidebarMenuItem>
            <div className="flex justify-evenly items-center gap-3 text-muted-foreground">
              <ExternalLink href="https://x.com/CodZombiesGuide" title="Twitter" aria-label="Check out our Twitter profile">
                <X className="size-5" />
              </ExternalLink>
              <Separator orientation="vertical" className="min-h-5" />
              <ExternalLink href="https://discord.gg/callofduty" title="Discord" aria-label="Join the Official Call of Duty Discord">
                <Discord className="size-5" />
              </ExternalLink>
              <Separator orientation="vertical" className="min-h-5" />
              <ExternalLink href="https://www.reddit.com/r/CODZombies/" title="Reddit" aria-label="Join the Official Call of Duty: Zombies Subreddit">
                <Reddit className="size-5" />
              </ExternalLink>
              <Separator orientation="vertical" className="min-h-5" />
              <ShareButton 
                title={ `${currentMap} interactive map` } 
                url={ createShareableURL() }
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
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
    case 'vehicle-spawn':
      return (
        <Image 
          unoptimized
          src={`/icons/boat.webp`}
          height={ 128 }
          width={ 128 }
          alt={`${type} Image`}
          className="size-8"
        />
      )
  }
}