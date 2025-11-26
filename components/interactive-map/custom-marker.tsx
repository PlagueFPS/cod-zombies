import type { MapMarker } from "@/map-configs/markers"
import { type DivIcon, divIcon, type LatLng } from "leaflet"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Marker as LeafletMarker, useMap } from "react-leaflet"
import { type TMapSettings, useMapSettings } from "@/contexts/interactive-map-settings"

interface CustomMarkerProps {
	id: string
	marker: MapMarker
	position: LatLng
	children?: React.ReactNode
}

interface IMarkerIcon extends Pick<CustomMarkerProps, "id" | "marker"> {
	settings: Pick<TMapSettings, "markers">["markers"]
}

export default function CustomMarker({ id, marker, position, children }: CustomMarkerProps) {
	const { settings } = useMapSettings()
	const [icon, setIcon] = useState<DivIcon | null>(null)
	const map = useMap()

	useEffect(() => {
		const iconElement = document.createElement("div")
		iconElement.className = "custom-marker"

		const root = createRoot(iconElement)
		root.render(<MarkerIcon id={id} marker={marker} settings={settings.markers} />)

		const customIcon = divIcon({
			html: iconElement,
			className: "custom-marker-container",
			iconSize: [settings.markers.iconSize, settings.markers.iconSize],
			iconAnchor: [settings.markers.iconSize / 2, settings.markers.iconSize / 2],
			popupAnchor: [0, -settings.markers.iconSize / 2],
		})

		setIcon(customIcon)
		// wait for react to finish rendering before unmounting
		return () => {
			setTimeout(() => root.unmount(), 0)
		}
	}, [marker, id, settings.markers])

	const handleClick = () => {
		map.flyTo(position, map.getZoom(), {
			animate: !settings.general.disableFlyToAnimation,
		})
	}

	return (
		<>
			{icon ? (
				<LeafletMarker
					icon={icon}
					position={position}
					zIndexOffset={marker.type === "label" ? -1000 : 1000}
					eventHandlers={{
						click: handleClick,
					}}
				>
					{children}
				</LeafletMarker>
			) : null}
		</>
	)
}

function MarkerIcon({ marker, id, settings }: IMarkerIcon) {
	const [error, setError] = useState(false)

	if (marker.type === "label") {
		return (
			<div className="flex items-center justify-center whitespace-nowrap text-sm text-white">
				<span className="rounded bg-black/25 px-2 py-1 shadow-lg">{marker.title}</span>
			</div>
		)
	}

	const getWidthAndHeight = () => {
		if (marker.id === "shovel") {
			return Math.floor(settings.iconSize * 1.5)
		}
		if (marker.type === "perk" && marker.id !== "der-wunderfizz") {
			return Math.floor(settings.iconSize * 0.75)
		}

		return settings.iconSize
	}

	return (
		<div id={id} className="flex items-center justify-center">
			{!error && marker.icon ? (
				<Image
					unoptimized
					src={marker.icon}
					alt={marker.title}
					width={getWidthAndHeight()}
					height={getWidthAndHeight()}
					style={{
						width: getWidthAndHeight(),
						height: getWidthAndHeight(),
						opacity: settings.opacity,
					}}
					onError={() => setError(true)}
				/>
			) : (
				<div
					style={{
						width: settings.iconSize,
						height: settings.iconSize,
						opacity: settings.opacity,
					}}
					className="rounded-full bg-primary"
				/>
			)}
		</div>
	)
}
