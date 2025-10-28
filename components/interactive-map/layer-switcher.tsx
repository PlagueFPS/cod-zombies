"use client"
import type { MapLayer } from "@/map-configs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "@/lib/utils"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { slugify } from "@/utils/functions.client"

interface LayerSwitcher {
	mapLayers: MapLayer[]
}

export default function LayerSwitcher({ mapLayers }: LayerSwitcher) {
	const { createParams, updateURLParams, searchParams } = useMapSearchParams()
	const layerParam = searchParams.get("layer")
	const currentLayer = mapLayers.find(layer => layer.id === layerParam) ?? mapLayers.at(0)
	if (!currentLayer) return null

	const handleValueChange = (layer: string) => {
		const params = createParams()
		params.set("layer", slugify(layer))
		updateURLParams(params)
	}

	return (
		<Select value={currentLayer.title} onValueChange={handleValueChange}>
			<SelectTrigger className="w-full">
				<SelectValue>{currentLayer.title}</SelectValue>
			</SelectTrigger>
			<SelectContent className="z-900">
				<SelectGroup>
					<SelectLabel>Map Layers</SelectLabel>
					{mapLayers.map((layer) => (
						<SelectItem key={layer.id} value={layer.title} className={cn({ "pointer-events-none": currentLayer.id === layer.id })}>
							<span className={cn({ "text-muted-foreground": currentLayer.id === layer.id })}>{layer.title}</span>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
