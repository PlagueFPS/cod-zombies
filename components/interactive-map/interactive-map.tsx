"use client"
import "leaflet/dist/leaflet.css"
import type { MapConfig } from "@/map-configs"
import type { Location, MapMarker } from "@/map-configs/markers"
import {
	CRS,
	LatLng,
	LatLngBounds,
	type LatLngTuple,
	type LeafletMouseEvent,
} from "leaflet"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import NextImage from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from "react-leaflet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMapSettings } from "@/contexts/interactive-map-settings"
import { useMapSearchParams } from "@/hooks/use-map-search-params"
import { cn } from "@/lib/utils"
import { generateMarkerKey } from "@/map-configs/markers"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { capitalize } from "@/utils/functions.client"
import { MarkerBadge } from "../custom-badges/custom-badges"
import { Separator } from "../ui/separator"
import CustomMarker from "./custom-marker"
import MapSettingsPanel from "./map-settings-panel"

export interface ImageDimensions {
	width: number
	height: number
}

export interface MapController {
	imageDimensions: ImageDimensions | null
}

interface IInteractiveMap {
	mapConfig: MapConfig
}

export default function InteractiveMap({ mapConfig }: IInteractiveMap) {
	const { includeParams, excludeParams, isIncluded } = useMapSearchParams()
	const { settings } = useMapSettings()
	const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
	const filteredMarkers = useMemo(() => {
		if (includeParams.length === 0 && excludeParams.length === 0) return mapConfig.markers

		return mapConfig.markers.filter(marker => {
			const markerId = marker.type || marker.id
			return isIncluded(markerId)
		})
	}, [includeParams, excludeParams, mapConfig.markers, isIncluded])

	useEffect(() => {
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
					img.src = mapConfig.image
				})
			} catch (error) {
				console.error(`Failed to load map:`, error)
			}
		}

		loadImageDimensions()
	}, [mapConfig.image])

	const convertToLeafletCoords = useCallback(
		({ x, y }: Location): LatLng => {
			if (!imageDimensions) return new LatLng(0, 0)
			return new LatLng(
				imageDimensions.height - y * imageDimensions.height,
				x * imageDimensions.width,
			)
		},
		[imageDimensions],
	)

	const getImageBounds = useCallback((): LatLngBounds => {
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
	}, [imageDimensions])

	return (
		<MapContainer
			key={mapConfig.id}
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
		>
			<MapController imageDimensions={imageDimensions} />
			<MapSettingsPanel />
			{imageDimensions && (
				<ImageOverlay key={mapConfig.id} url={mapConfig.image} bounds={getImageBounds()} />
			)}
			{/* We do not map through filteredMarkers for rendering to avoid icon flickering */}
			{imageDimensions &&
				mapConfig.markers.map(marker => {
					if (
						!filteredMarkers.some(m => {
							if (marker.type) return marker.type === m.type
							return marker.id === m.id
						})
					)
						return null

					return marker.locations.map(location => (
						// force re-render when popups settings change to apply them
						<CustomMarker
							key={`${generateMarkerKey(marker.id, location)}-gradients:${settings.popups.disableGradients}`}
							id={generateMarkerKey(marker.id, location)}
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

const logClickCoordinates = (imageDimensions: ImageDimensions | null) => (e: LeafletMouseEvent) => {
	if (!IN_DEVELOPMENT || !e.latlng || !imageDimensions) return

	const x = e.latlng.lng / imageDimensions.width
	const y = 1 - e.latlng.lat / imageDimensions.height // Flip y back to normal
	console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
}

function MapController({ imageDimensions }: MapController) {
	const map = useMap()

	useMapEvents({
		click: logClickCoordinates(imageDimensions)
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
		<div className="fixed top-20 right-8 z-500 flex gap-2">
			<Badge variant={"outline"} className="rounded-md bg-background/80">
				<div className="flex flex-col gap-1">
					<Button variant={"ghost"} size={"icon"} onClick={handleZoomIn} title="Zoom In">
						<ZoomIn className="size-4" />
					</Button>
					<Separator orientation="horizontal" />
					<Button variant={"ghost"} size={"icon"} onClick={handleZoomOut} title="Zoom Out">
						<ZoomOut className="size-4" />
					</Button>
					<Separator orientation="horizontal" />
					<Button variant={"ghost"} size={"icon"} onClick={handleReset} title="Reset Zoom">
						<RotateCcw className="size-4" />
					</Button>
				</div>
			</Badge>
		</div>
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
							{ "size-12": marker.type === "perk" && marker.id !== "der-wunderfizz" },
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
