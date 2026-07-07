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
import { useMapSearch } from "@/hooks/use-map-search"
import { cn } from "@/lib/utils"
import { slugify } from "@/utils/shared-functions"

interface LayerSwitcher {
	mapLayers: MapConfigLayer[]
}

export function LayerSwitcher({ mapLayers }: LayerSwitcher) {
	const { layer, updateLayer } = useMapSearch()
	const currentLayer = !layer
		? Arr.head(mapLayers)
		: Arr.findFirst(mapLayers, l => l.id === layer).pipe(
				Option.match({
					onNone: () => Arr.head(mapLayers),
					onSome: l => Option.some(l),
				}),
			)

	if (Option.isNone(currentLayer)) return null

	const handleValueChange = (title: string | null) => {
		if (!title) return
		updateLayer(slugify(title))
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
