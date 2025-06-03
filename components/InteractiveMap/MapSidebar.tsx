"use client"
import type { MapId } from "@/map-configs"
import { useParams } from "next/navigation"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "../ui/sidebar"
import { capatilize } from "@/utils/functions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { CustomLink } from "../CustomLink/CustomLink"

interface IMapSidebar {
  availableMaps: MapId[]
}

export default function MapSidebar({ availableMaps }: IMapSidebar) {
  const { id } = useParams()
  const currentMap = capatilize(String(id))

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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
