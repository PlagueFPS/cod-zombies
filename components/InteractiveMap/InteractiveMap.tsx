"use client"
import 'leaflet/dist/leaflet.css'
import type { ImageDimensions, Location, MapConfig, MapController, MapMarker } from "@/types/InteractiveMap"
import { CRS, LatLng, LatLngBounds, LatLngTuple, LeafletMouseEvent, Map } from "leaflet"
import { ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from "react-leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import CustomMarker from './CustomMarker'
import { capatilize } from "@/utils/functions"
import { useMapSearchParams } from '@/hooks/useMapSearchParams'
import { Separator } from '../ui/separator'

const logClickCoordinates = (imageDimensions: ImageDimensions | null) => (e: LeafletMouseEvent) => {
  if (!e.latlng || !imageDimensions) return

  const x = e.latlng.lng / imageDimensions.width
  const y = 1 - e.latlng.lat / imageDimensions.height // Flip y back to normal
  console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
}

export default function InteractiveMap({ mapConfig }: { mapConfig: MapConfig }) {
  const { searchParams, filterParams } = useMapSearchParams()
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
  const [filteredMarkers, setMarkers] = useState<MapMarker[]>([])
  const mapRef = useRef<Map>(null)

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
  }, [])

  useEffect(() => {
    let markers = mapConfig.markers

    if (filterParams.length > 0) {
      markers = mapConfig.markers.filter(marker => {
        if (marker.type === "objective") return !filterParams.includes(marker.id)
        else return !filterParams.includes(marker.type)
      })
    }

    setMarkers(markers)
  }, [searchParams])

  const convertToLeafletCoords = useCallback(({ x, y }: Location): LatLng => {
    if (!imageDimensions) return new LatLng(0, 0)
    return new LatLng(
      imageDimensions.height - y * imageDimensions.height, 
      x * imageDimensions.width
    )
  }, [imageDimensions])

  const getImageBounds = useCallback((): LatLngBounds => {
    if (!imageDimensions) {
      return new LatLngBounds([
        [0, 0],
        [1024, 1024]
      ])
    }

    return new LatLngBounds([
      [0, 0], // Soutwest Corner
      [imageDimensions.height, imageDimensions.width] // Northeast Corner
    ])
  }, [imageDimensions])

  return (
    <MapContainer
      key={ mapConfig.id }
      ref={ mapRef }
      center={
        imageDimensions ? [imageDimensions.height / 2, imageDimensions.width / 2] 
        : [1024, 1024]
      }
      zoom={ 0 }
      minZoom={ -2 }
      maxZoom={ 3 }
      crs={ CRS.Simple }
      style={{ height: "100%", width: "100%" }}
      zoomControl={ false }
      attributionControl={ false }
      className='relative bg-accent! dark:bg-secondary-alternative!'
    >
      <MapController imageDimensions={ imageDimensions } />
      { imageDimensions && (
        <ImageOverlay 
          key={ mapConfig.id }
          url={ mapConfig.image }
          bounds={ getImageBounds() }
        />
      )}

      { imageDimensions && mapConfig.markers.map(marker => {
        if (!filteredMarkers.includes(marker)) return null

        return marker.locations.map(location => (
          <CustomMarker
            key={ `${marker.id}-${location.x}-${location.y}` }
            marker={ marker }
            position={convertToLeafletCoords(location)}
          >
            { marker.type !== "label" ? (
              <Popup className='custom-popup'>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
                    { capatilize(marker.type) }
                  </Badge>
                </div>
                <h3 className="font-extrabold text-lg text-gradient dark:dark-text-gradient">{ location.title || marker.title }</h3>
                <p className="text-sm text-foreground/90">{ location.description || marker.description }</p>
              </Popup>
            ) : null}
          </CustomMarker>
        ))
      })}
    </MapContainer>
  )
}

function MapController({ imageDimensions }: MapController) {
  const map = useMap()

  useMapEvents({
    click: logClickCoordinates(imageDimensions)
  })

  useEffect(() => {
    if (imageDimensions) {
      const center: LatLngTuple = [imageDimensions.height / 2, imageDimensions.width / 2]
      map.setView(center, 0, { animate: false })
      map.fitBounds([[0, 0], [imageDimensions.height, imageDimensions.width]])
      setTimeout(() => {
        map.setZoom(0, { animate: false })
      }, 0)
    }

  }, [map, imageDimensions])

  const handleZoomIn = useCallback(() => {
    map.zoomIn()
  }, [map])

  const handleZoomOut = useCallback(() => {
    map.zoomOut()
  }, [map])

  const handleReset = useCallback(() => {
    if (imageDimensions) {
      const center: LatLngTuple = [imageDimensions.height / 2, imageDimensions.width / 2]
      map.setView(center, 0)
    }
  }, [map, imageDimensions])

  return (
    <div className="fixed top-18 right-4 z-500 flex gap-2">
      <Badge variant={"outline"} className="bg-background/80 rounded-md">
        <div className="flex flex-col gap-1">
          <Button variant={"ghost"} size={"icon"} onClick={ handleZoomIn } title="Zoom In">
            <ZoomIn className="size-4" />
          </Button>
          <Separator orientation='horizontal' />
          <Button variant={"ghost"} size={"icon"} onClick={ handleZoomOut } title="Zoom Out">
            <ZoomOut className="size-4" />
          </Button>
          <Separator orientation='horizontal' />
          <Button variant={"ghost"} size={"icon"} onClick={ handleReset } title="Reset Zoom">
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </Badge>
    </div>
  )
}
