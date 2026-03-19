"use client"
import "leaflet/dist/leaflet.css"
import type { MapConfig } from "@/map-configs"
import type { Location, MapMarker } from "@/map-configs/markers"
import { Option } from "effect"
import { CRS, LatLng, LatLngBounds, type LatLngTuple, type LeafletMouseEvent } from "leaflet"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import NextImage from "next/image"
import { useEffect, useState } from "react"
import { ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from "react-leaflet"
import CustomMarker from "@/components/client/custom-marker"
import MapSettingsPanel from "@/components/client/map-settings-panel"
import { MarkerBadge } from "@/components/server/custom-badges"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useMapSettings } from "@/contexts/interactive-map-settings"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { cn } from "@/lib/utils"
import { generateMarkerKey } from "@/map-configs/markers"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { capitalize } from "@/utils/shared-functions"

export interface ImageDimensions {
	width: number
	height: number
}

interface MapController {
	imageDimensions: Option.Option<ImageDimensions>
}

interface IInteractiveMap {
	mapConfig: MapConfig
}

export default function InteractiveMap({ mapConfig }: IInteractiveMap) {
	const { layerParam, includeParams, excludeParams, isIncluded } = useMapSearchParams()
	const { settings } = useMapSettings()
	const [imageDimensions, setImageDimensions] = useState<Option.Option<ImageDimensions>>(
		Option.none(),
	)
	const currentLayer = Option.match(layerParam, {
		onNone: () => Option.fromNullishOr(mapConfig.layers.at(0)),
		onSome: layerParam =>
			Option.fromNullishOr(
				mapConfig.layers.find(layer => layer.id === layerParam) ?? mapConfig.layers.at(0),
			),
	})

	// dynamically load map image to extract its dimensions for map bounds
	useEffect(() => {
		if (Option.isNone(currentLayer)) return
		const loadImageDimensions = async () => {
			try {
				const img = new Image()
				img.crossOrigin = "anonymous"

				await new Promise((resolve, reject) => {
					img.onload = () => {
						setImageDimensions(
							Option.some({
								width: img.naturalWidth,
								height: img.naturalHeight,
							}),
						)
						resolve(img)
					}
					img.onerror = reject
					img.src = currentLayer.value.image
				})
			} catch (error) {
				console.error(`Failed to load map:`, error)
			}
		}

		loadImageDimensions()
	}, [currentLayer])

	if (Option.isNone(currentLayer)) return null

	const shouldRenderMarker = (marker: MapMarker) => {
		if (includeParams.length === 0 && excludeParams.length === 0) return true
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
			[0, 0], // Soutwest Corner
			[imageDimensions.value.height, imageDimensions.value.width], // Northeast Corner
		])
	}

	return (
		<MapContainer
			key={`${mapConfig.id}-${settings.popups.disableAnimations}-${settings.general.disableZoomAnimation}`}
			center={
				Option.isSome(imageDimensions)
					? [imageDimensions.value.height / 2, imageDimensions.value.width / 2]
					: [1024, 1024]
			}
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
				<ImageOverlay
					key={currentLayer.value.id}
					url={currentLayer.value.image}
					bounds={getImageBounds()}
				/>
			)}
			{/* We do not map through filteredMarkers for rendering to avoid icon flickering */}
			{Option.isSome(imageDimensions) &&
				currentLayer.value.markers.map(marker => {
					if (!shouldRenderMarker(marker)) return null

					return marker.locations.map(location => (
						// force re-render when popups settings change to apply them
						<CustomMarker
							key={`${generateMarkerKey(currentLayer.value.id, marker.id, location)}-gradients:${settings.popups.disableGradients}`}
							id={generateMarkerKey(currentLayer.value.id, marker.id, location)}
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
			if (!IN_DEVELOPMENT || !e.latlng || Option.isNone(imageDimensions)) return

			const x = e.latlng.lng / imageDimensions.value.width
			const y = 1 - e.latlng.lat / imageDimensions.value.height // Flip y back to normal
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
		// Do not assign gradient classes if disabled
		if (settings.popups.disableGradients) {
			return "custom-popup"
		}

		switch (marker.category) {
			case "general":
				return "custom-popup general-popup"
			case "equipment":
				return "custom-popup equipment-popup"
			case "upgrades":
				return "custom-popup upgrades-popup"
			case "objectives":
				return "custom-popup objectives-popup"
			case "transportation":
				return "custom-popup transportation-popup"
			case "intel":
				return "custom-popup intel-popup"
		}
	}

	return (
		<Popup className={getClassName()}>
			<div className="absolute top-4 left-4 mb-1 flex w-full items-center gap-2">
				<MarkerBadge category={marker.category}>{capitalize(marker.category)}</MarkerBadge>
			</div>
			{marker.icon && (
				<div className="flex w-full items-center justify-center">
					<NextImage
						unoptimized
						src={marker.icon}
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
				className={cn("text-center font-extrabold text-lg", {
					"text-orange-700 dark:text-orange-200": marker.category === "objectives",
					"text-blue-600 dark:text-blue-200": marker.category === "general",
					"text-green-600 dark:text-green-200": marker.category === "transportation",
					"text-yellow-700 dark:text-yellow-200": marker.category === "upgrades",
					"dark:dark-text-gradient text-gradient": marker.category === "equipment",
					"text-purple-600 dark:text-purple-200": marker.category === "intel",
				})}
			>
				{location.title || marker.title}
			</h3>
			<p
				className={cn("px-2 text-center text-foreground/90 text-sm", {
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
