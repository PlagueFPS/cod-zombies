import "leaflet/dist/leaflet.css"
import "@/styles/leaflet-overrides.css"
import type { Location, MapMarker } from "@/map-configs/markers"
import { cn } from "cn"
import { Match, Option, Array as Arr, Predicate } from "effect"
import { CRS, LatLng, LatLngBounds, type LatLngTuple, type LeafletMouseEvent } from "leaflet"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from "react-leaflet"
import { MarkerBadge } from "@/components/custom-badges"
import CustomMarker from "@/components/custom-marker"
import { Image as CustomImage } from "@/components/image"
import MapSettingsPanel from "@/components/map-settings-panel"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useMapSettings } from "@/contexts/interactive-map-settings"
import { useMapSearch } from "@/hooks/use-map-search"
import { generateMarkerKey } from "@/map-configs/markers"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { decodeMapConfigLayer, type EncodedMapConfigLayer } from "@/utils/rsc-wire"
import { capitalize } from "@/utils/shared-functions"

export interface ImageDimensions {
	width: number
	height: number
}

interface MapController {
	imageDimensions: Option.Option<ImageDimensions>
}

interface InteractiveMapProps {
	currentLayer: EncodedMapConfigLayer
}

export function InteractiveMap({ currentLayer }: InteractiveMapProps) {
	const { include, exclude, isIncluded } = useMapSearch()
	const { settings } = useMapSettings()

	const [imageDimensions, setImageDimensions] = useState<Option.Option<ImageDimensions>>(
		Option.none(),
	)

	const layer = useMemo(() => decodeMapConfigLayer(currentLayer), [currentLayer])

	useEffect(() => {
		const img = new Image()
		img.crossOrigin = "anonymous"
		img.onload = () => {
			setImageDimensions(
				Option.some({
					width: img.naturalWidth,
					height: img.naturalHeight,
				}),
			)
		}

		img.onerror = () => {
			console.error(`Failed to load map:`, layer.image)
		}

		img.src = layer.image
	}, [layer.image])

	const shouldRenderMarker = (marker: MapMarker) => {
		if (include.length === 0 && exclude.length === 0) return true

		return isIncluded(marker.type || marker.id)
	}

	const convertToLeafletCoords = ({ x, y }: Location): LatLng => {
		if (Option.isNone(imageDimensions)) return new LatLng(0, 0)

		return new LatLng(
			imageDimensions.value.height - y * imageDimensions.value.height,
			x * imageDimensions.value.width,
		)
	}

	const getImageBounds = (): LatLngBounds => {
		if (Option.isNone(imageDimensions)) {
			return new LatLngBounds([
				[0, 0],
				[1024, 1024],
			])
		}

		return new LatLngBounds([
			[0, 0],
			[imageDimensions.value.height, imageDimensions.value.width],
		])
	}

	return (
		<MapContainer
			key={`${layer.id}-${settings.popups.disableAnimations}-${settings.general.disableZoomAnimation}`}
			center={Option.match(imageDimensions, {
				onSome: (dimensions): LatLngTuple => [dimensions.height / 2, dimensions.width / 2],
				onNone: (): LatLngTuple => [1024, 1024],
			})}
			zoom={0}
			minZoom={-2}
			maxZoom={3}
			crs={CRS.Simple}
			style={{ height: "100%", width: "100%" }}
			zoomControl={false}
			attributionControl={false}
			className="bg-accent! dark:bg-accent/10!"
			fadeAnimation={!settings.popups.disableAnimations}
			zoomAnimation={!settings.general.disableZoomAnimation}
			markerZoomAnimation={!settings.general.disableZoomAnimation}
		>
			<MapController imageDimensions={imageDimensions} />
			{Option.isSome(imageDimensions) && (
				<ImageOverlay key={currentLayer.id} url={currentLayer.image} bounds={getImageBounds()} />
			)}
			{Option.isSome(imageDimensions) &&
				Arr.map(layer.markers, marker => {
					if (!shouldRenderMarker(marker)) return null

					return Arr.map(marker.locations, location => (
						<CustomMarker
							key={`${generateMarkerKey(currentLayer.id, marker.id, location)}-gradients:${settings.popups.disableGradients}`}
							id={generateMarkerKey(currentLayer.id, marker.id, location)}
							marker={marker}
							position={convertToLeafletCoords(location)}
						>
							{marker.type !== "label" ? <CustomPopup marker={marker} location={location} /> : null}
						</CustomMarker>
					))
				})}
		</MapContainer>
	)
}

function MapController({ imageDimensions }: MapController) {
	const map = useMap()

	const logClickCoordinates =
		(imageDimensions: Option.Option<ImageDimensions>) => (e: LeafletMouseEvent) => {
			if (
				!IN_DEVELOPMENT ||
				!(Predicate.isNotNullish(e.latlng) && Predicate.isTruthy(e.latlng)) ||
				Option.isNone(imageDimensions)
			)
				return

			const x = e.latlng.lng / imageDimensions.value.width
			const y = 1 - e.latlng.lat / imageDimensions.value.height
			console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
		}

	useMapEvents({
		click: logClickCoordinates(imageDimensions),
	})

	if (Option.isSome(imageDimensions)) {
		const center: LatLngTuple = [imageDimensions.value.height / 2, imageDimensions.value.width / 2]
		map.setView(center, 0, { animate: false })
	}

	const handleZoomIn = () => {
		map.zoomIn()
	}

	const handleZoomOut = () => {
		map.zoomOut()
	}

	const handleReset = () => {
		if (Option.isNone(imageDimensions)) return
		const center: LatLngTuple = [imageDimensions.value.height / 2, imageDimensions.value.width / 2]
		map.setView(center, 0)
	}

	return (
		<ButtonGroup
			orientation="vertical"
			className={cn(
				"absolute top-8 right-4 z-50 w-10 rounded-md bg-background md:w-fit lg:right-8",
			)}
		>
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="icon-lg" />}
					onClick={handleZoomIn}
					aria-label="Zoom In"
					className="w-full"
				>
					<ZoomIn className="size-4" />
				</TooltipTrigger>
				<TooltipContent side="left" sideOffset={5} className="z-999">
					Zoom In
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="icon-lg" />}
					onClick={handleZoomOut}
					aria-label="Zoom Out"
					className="w-full"
				>
					<ZoomOut className="size-4" />
				</TooltipTrigger>
				<TooltipContent side="left" sideOffset={5} className="z-999">
					Zoom Out
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="icon-lg" />}
					onClick={handleReset}
					aria-label="Reset Zoom"
					className="w-full"
				>
					<RotateCcw className="size-4" />
				</TooltipTrigger>
				<TooltipContent side="left" sideOffset={5} className="z-999">
					Reset Zoom
				</TooltipContent>
			</Tooltip>
			<MapSettingsPanel />
		</ButtonGroup>
	)
}

function CustomPopup({ marker, location }: { marker: MapMarker; location: Location }) {
	const { settings } = useMapSettings()

	const getClassName = () => {
		if (settings.popups.disableGradients) {
			return "custom-popup"
		}

		return Match.value(marker.category).pipe(
			Match.when("general", () => "custom-popup general-popup"),
			Match.when("equipment", () => "custom-popup equipment-popup"),
			Match.when("upgrades", () => "custom-popup upgrades-popup"),
			Match.when("objectives", () => "custom-popup objectives-popup"),
			Match.when("transportation", () => "custom-popup transportation-popup"),
			Match.when("intel", () => "custom-popup intel-popup"),
			Match.exhaustive,
		)
	}

	return (
		<Popup className={getClassName()}>
			<div className="absolute top-4 left-4 mb-1 flex w-full items-center gap-2">
				<MarkerBadge category={marker.category}>{capitalize(marker.category)}</MarkerBadge>
			</div>
			{Option.isSome(marker.icon) && (
				<div className="flex w-full items-center justify-center">
					<CustomImage
						src={marker.icon.value}
						alt={marker.title}
						width={128}
						height={128}
						className={cn(
							"size-16",
							{
								"size-12": marker.type === "perk" && marker.id !== "der-wunderfizz",
							},
							{ "size-12": marker.id === "dark-aether-lantern" },
						)}
					/>
				</div>
			)}
			<h3
				className={cn("text-center text-lg font-extrabold", {
					"text-orange-700 dark:text-orange-200": marker.category === "objectives",
					"text-blue-600 dark:text-blue-200": marker.category === "general",
					"text-green-600 dark:text-green-200": marker.category === "transportation",
					"text-yellow-700 dark:text-yellow-200": marker.category === "upgrades",
					"text-gradient dark:dark-text-gradient": marker.category === "equipment",
					"text-purple-600 dark:text-purple-200": marker.category === "intel",
				})}
			>
				{location.title || marker.title}
			</h3>
			<p
				className={cn("px-2 text-center text-sm text-foreground/90", {
					"text-orange-800 dark:text-orange-200": marker.category === "objectives",
					"text-blue-600 dark:text-blue-200": marker.category === "general",
					"text-green-600 dark:text-green-200": marker.category === "transportation",
					"text-yellow-700 dark:text-yellow-200": marker.category === "upgrades",
					"text-purple-600 dark:text-purple-200": marker.category === "intel",
				})}
			>
				{location.description || marker.description}
			</p>
		</Popup>
	)
}
