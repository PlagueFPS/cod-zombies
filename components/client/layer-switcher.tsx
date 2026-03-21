"use client"
import type { MapConfigLayer } from "@/data/interactive-map"

import { Array as Arr, Option } from "effect"

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { cn } from "@/lib/utils"
import { slugify } from "@/utils/shared-functions"

interface LayerSwitcher {
	mapLayers: MapConfigLayer[]
}

export function LayerSwitcher({ mapLayers }: LayerSwitcher) {
	const { createParams, updateURLParams, layerParam } = useMapSearchParams()
	const currentLayer = Option.match(layerParam, {
		onNone: () => Arr.head(mapLayers),
		onSome: layerParam =>
			Arr.findFirst(mapLayers, layer => layer.id === layerParam).pipe(
				Option.match({
					onNone: () => Arr.head(mapLayers),
					onSome: layer => Option.some(layer),
				}),
			),
	})

	if (Option.isNone(currentLayer)) return null

	const handleValueChange = (layer: string | null) => {
		if (!layer) return
		const params = createParams()
		params.set("layer", slugify(layer))
		updateURLParams(params)
	}

	return (
		<Select value={currentLayer.value.title} onValueChange={handleValueChange}>
			<SelectTrigger className="w-full">
				<SelectValue>{currentLayer.value.title}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Map Layers</SelectLabel>
					{mapLayers.map(layer => (
						<SelectItem
							key={layer.id}
							value={layer.title}
							className={cn({ "pointer-events-none": currentLayer.value.id === layer.id })}
						>
							<span className={cn({ "text-muted-foreground": currentLayer.value.id === layer.id })}>
								{layer.title}
							</span>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
