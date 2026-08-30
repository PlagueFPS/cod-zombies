import type { MapMarker } from "@/map-configs/markers"
import { Option } from "effect"
import { DivIcon, type LatLng } from "leaflet"
import { useEffect, useRef, useState } from "react"
import { Marker as LeafletMarker, useMap } from "react-leaflet"
import { useMapSettings } from "@/contexts/interactive-map-settings"

interface CustomMarkerProps {
	id: string
	marker: MapMarker
	position: LatLng
	children?: React.ReactNode
}

export default function CustomMarker({ id, marker, position, children }: CustomMarkerProps) {
	const { settings } = useMapSettings()
	const [icon, setIcon] = useState<DivIcon | null>(null)
	const map = useMap()
	const iconRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!iconRef.current) {
			iconRef.current = document.createElement("div")

			const getWidthAndHeight = () => {
				if (marker.type === "perk" && marker.id !== "der-wunderfizz") {
					return Math.floor(settings.markers.iconSize * 0.75)
				}

				switch (marker.id) {
					case "void-claw-pedestal":
						return Math.floor(settings.markers.iconSize * 1.75)
					case "shovel":
					case "aether-plant-spray":
						return Math.floor(settings.markers.iconSize * 1.5)
					case "aether-crystal":
						return Math.floor(settings.markers.iconSize * 1.25)
					default:
						return settings.markers.iconSize
				}
			}

			if (marker.type === "label") {
				iconRef.current.className =
					"custom-marker flex items-center justify-center whitespace-nowrap text-sm text-white"
				iconRef.current.innerHTML = `
						<span class="rounded bg-black/25 px-2 py-1 shadow-lg">${marker.title}</span>
					`
			} else {
				iconRef.current.id = id
				iconRef.current.className = "custom-marker flex items-center justify-center"
				const widthAndHeight = getWidthAndHeight()
				const iconSrc = Option.getOrElse(
					marker.icon,
					() => `/icons/${marker.category}/${marker.id}.webp`,
				)
				iconRef.current.innerHTML = `
					<img
						src="${iconSrc}"
						alt="${marker.title}"
						width="${widthAndHeight}"
						height="${widthAndHeight}"
						loading="lazy"
						style="width: ${widthAndHeight}px; height: ${widthAndHeight}px; opacity: ${settings.markers.opacity};"
						class="w-full h-full"
					/>
					`
			}
		}

		const customIcon = new DivIcon({
			html: iconRef.current,
			iconSize: [settings.markers.iconSize, settings.markers.iconSize],
			iconAnchor: [settings.markers.iconSize / 2, settings.markers.iconSize / 2],
			popupAnchor: [0, -settings.markers.iconSize / 2],
		})

		setIcon(customIcon)
		return () => {
			iconRef.current = null
		}
	}, [marker, id, settings.markers.iconSize, settings.markers.opacity])

	const handleClick = () => {
		map.flyTo(position, map.getZoom(), {
			animate: !settings.general.disableFlyToAnimation,
		})
	}

	return (
		<>
			{icon && (
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
			)}
		</>
	)
}
