"use client"
import "leaflet/dist/leaflet.css"
import type { MapConfig } from "@/map-configs"
import type { Location, MapMarker } from "@/map-configs/markers"
import { CRS, LatLng, LatLngBounds, type LatLngTuple, type LeafletMouseEvent } from "leaflet"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import NextImage from "next/image"
import { useEffect, useState } from "react"
import { ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from "react-leaflet"
import { Button } from "@/components/ui/button"
import { useMapSettings } from "@/contexts/interactive-map-settings"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { generateMarkerKey } from "@/map-configs/markers"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { capitalize } from "@/utils/functions.client"
import { MarkerBadge } from "../custom-badges/custom-badges"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import CustomMarker from "./custom-marker"
import MapSettingsPanel from "./map-settings-panel"
import { ButtonGroup } from "../ui/button-group"

export interface ImageDimensions {
	width: number
	height: number
}

interface MapController {
	imageDimensions: ImageDimensions | null
}

interface IInteractiveMap {
	mapConfig: MapConfig
}

/**
 * Render an interactive single-image map with markers, popups, and custom controls.
 *
 * Uses the provided map configuration to determine the active layer (via URL params), load the map image
 * to derive bounds and coordinate conversions, and render a react-leaflet MapContainer with an image overlay,
 * markers filtered by include/exclude search params, and the map control UI.
 *
 * @param mapConfig - Map configuration containing an `id` and an ordered list of layers (each layer includes an `id`, `image` URL, and `markers`)
 * @returns A React element for the interactive map, or `null` when no layer is available.
 */
export default function InteractiveMap({ mapConfig }: IInteractiveMap) {
	const { layerParam, includeParams, excludeParams, isIncluded } = useMapSearchParams()
	const { settings } = useMapSettings()
	const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
	const currentLayer = mapConfig.layers.find(layer => layer.id === layerParam) ?? mapConfig.layers.at(0)

	// disable main page scrolling on canvas
	useEffect(() => {
		document.body.classList.add("no-scroll")
		return () => {
			document.body.classList.remove("no-scroll")
		}
	}, [])

	// dynamically load map image to extract its dimensions for map bounds
	useEffect(() => {
		if (!currentLayer) return
		const loadImageDimensions = async () => {
				try {
					const img = new Image()
					img.crossOrigin = "anonymous"

					await new Promise((resolve, reject) => {
						img.onload = () => {
							setImageDimensions({
								width: img.naturalWidth,
								height: img.naturalHeight,
							})
							resolve(img)
						}
						img.onerror = reject
						img.src = currentLayer.image
					})
				} catch (error) {
					console.error(`Failed to load map:`, error)
				}
		}

		loadImageDimensions()
	}, [currentLayer])

	if (!currentLayer) return null

	const shouldRenderMarker = (marker: MapMarker) => {
		if (includeParams.length === 0 && excludeParams.length === 0) return true
		return isIncluded(marker.type || marker.id)
	}

	const convertToLeafletCoords = ({ x, y }: Location): LatLng => {
		if (!imageDimensions) return new LatLng(0, 0)
		return new LatLng(
			imageDimensions.height - y * imageDimensions.height,
			x * imageDimensions.width,
		)
	}

	const getImageBounds = (): LatLngBounds => {
		if (!imageDimensions) {
			return new LatLngBounds([
				[0, 0],
				[1024, 1024],
			])
		}

		return new LatLngBounds([
			[0, 0], // Soutwest Corner
			[imageDimensions.height, imageDimensions.width], // Northeast Corner
		])
	}

	return (
		<MapContainer
			key={`${mapConfig.id}-${settings.popups.disableAnimations}-${settings.general.disableZoomAnimation}`}
			center={
				imageDimensions ? [imageDimensions.height / 2, imageDimensions.width / 2] : [1024, 1024]
			}
			zoom={0}
			minZoom={-2}
			maxZoom={3}
			crs={CRS.Simple}
			style={{ height: "100%", width: "100%" }}
			zoomControl={false}
			attributionControl={false}
			className="relative bg-accent! dark:bg-secondary-alternative!"
			fadeAnimation={!settings.popups.disableAnimations}
			zoomAnimation={!settings.general.disableZoomAnimation}
			markerZoomAnimation={!settings.general.disableZoomAnimation}
		>
			<MapController imageDimensions={imageDimensions} />
			{imageDimensions && (
				<ImageOverlay key={currentLayer.id} url={currentLayer.image} bounds={getImageBounds()} />
			)}
			{/* We do not map through filteredMarkers for rendering to avoid icon flickering */}
			{imageDimensions &&
				currentLayer.markers.map(marker => {
					if (!shouldRenderMarker(marker)) return null

					return marker.locations.map(location => (
						// force re-render when popups settings change to apply them
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

function MapController({
	imageDimensions
}: MapController) {
	const map = useMap()
	const isMobile = useIsMobile()

	const logClickCoordinates = (imageDimensions: ImageDimensions | null) => (e: LeafletMouseEvent) => {
		if (!IN_DEVELOPMENT || !e.latlng || !imageDimensions) return

		const x = e.latlng.lng / imageDimensions.width
		const y = 1 - e.latlng.lat / imageDimensions.height // Flip y back to normal
		console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
	}

	useMapEvents({
		click: logClickCoordinates(imageDimensions),
	})

	if (imageDimensions) {
		const center: LatLngTuple = [imageDimensions.height / 2, imageDimensions.width / 2]
		map.setView(center, 0, { animate: false })
	}

	const handleZoomIn = () => {
		map.zoomIn()
	}

	const handleZoomOut = () => {
		map.zoomOut()
	}

	const handleReset = () => {
		if (imageDimensions) {
			const center: LatLngTuple = [imageDimensions.height / 2, imageDimensions.width / 2]
			map.setView(center, 0)
		}
	}

	return (
		<ButtonGroup
			orientation={isMobile ? "vertical" : "horizontal"}
			className={cn("absolute top-4 right-4 z-500 lg:right-8 bg-background rounded-md w-10 md:w-fit")}
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-lg"
						onClick={handleZoomIn}
						aria-label="Zoom In"
						className={cn({
							"w-full": isMobile,
						})}
					>
						<ZoomIn className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent side={isMobile ? "left" : "bottom"} sideOffset={5} className="z-999">
					Zoom In
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-lg"
						onClick={handleZoomOut}
						className={cn({
							"w-full": isMobile,
						})}
						aria-label="Zoom Out"
					>
						<ZoomOut className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent side={isMobile ? "left" : "bottom"} sideOffset={5} className="z-999">
					Zoom Out
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-lg"
						onClick={handleReset}
						className={cn({
							"w-full": isMobile,
						})}
						aria-label="Reset Zoom"
					>
						<RotateCcw className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent side={isMobile ? "left" : "bottom"} sideOffset={5} className="z-999">
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