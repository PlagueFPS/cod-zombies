"use client"
import 'leaflet/dist/leaflet.css'
import type { ImageDimensions, MapConfig, MapController } from "@/types/InteractiveMap"
import { CRS, LatLng, LatLngBounds, LatLngTuple, LeafletMouseEvent, Map } from "leaflet"
import { ImageOverlay, MapContainer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Card } from "@/components/ui/card"

const logClickCoordinates = (imageDimensions: ImageDimensions | null) => (e: LeafletMouseEvent) => {
  if (!e.latlng || !imageDimensions) return

  const x = e.latlng.lng / imageDimensions.width
  const y = 1 - e.latlng.lat / imageDimensions.height // Flip y back to normal
  console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
}

export default function InteractiveMap({ mapConfig }: { mapConfig: MapConfig }) {
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
  const [zoom, setZoom] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
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
      } finally {
        setIsLoading(false)
      }
    }

    loadImageDimensions()
  }, [])

  const convertToLeafletCoords = useCallback((x: number, y: number): LatLng => {
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

  if (isLoading) return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="p-6 bg-card/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading map layers...</p>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map Info */}
      <div className="absolute top-4 right-4 z-100">
        <Card className="bg-card/80">
          <h2 className="font-bold text-lg text-gradient dark:dark-text-gradient">{ mapConfig.title }</h2>
          <p className="text-muted-foreground text-sm">Zoom: { zoom }</p>
        </Card>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        key={ mapConfig.id }
        ref={ mapRef }
        center={
          imageDimensions ? [imageDimensions.height / 2, imageDimensions.width / 2] 
          : [512, 512]
        }
        zoom={ 0 }
        minZoom={ -2 }
        maxZoom={ 3 }
        crs={ CRS.Simple }
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={ false }
        attributionControl={ false }
      >
        <MapController imageDimensions={ imageDimensions } onZoomChange={ setZoom } />
        { imageDimensions && (
          <ImageOverlay 
            key={ mapConfig.id }
            url={ mapConfig.image }
            bounds={ getImageBounds() }
          />
        )}

        { imageDimensions && mapConfig.markers.map(marker => (
          <Marker
            key={ marker.id }
            position={convertToLeafletCoords(marker.x, marker.y)}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="badge-primary-gradient dark:badge-primary-gradient">
                    { marker.type }
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm">{ marker.title }</h3>
                <p className="text-xs mt-1 text-muted-foreground">{ marker.description }</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

function MapController({ imageDimensions, onZoomChange }: MapController) {
  const map = useMap()

  useMapEvents({
    zoomend: () => {
      const zoom = map.getZoom()
      onZoomChange(zoom)
    },
    click: logClickCoordinates(imageDimensions)
  })

  useEffect(() => {
    if (imageDimensions) {
      const center: LatLngTuple = [imageDimensions.height / 2, imageDimensions.width / 2]
      map.setView(center, 0)
      map.fitBounds([[0, 0], [imageDimensions.height, imageDimensions.width]])
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
    <div className="absolute top-4 left-4 z-100 flex gap-2">
      <Badge variant={"outline"} className="bg-background/80">
        <div className="flex gap-2">
          <Button variant={"ghost"} size={"icon"} onClick={ handleZoomIn } title="Zoom In">
            <ZoomIn className="size-4" />
          </Button>
          <Button variant={"ghost"} size={"icon"} onClick={ handleZoomOut } title="Zoom Out">
            <ZoomOut className="size-4" />
          </Button>
          <Button variant={"ghost"} size={"icon"} onClick={ handleReset } title="Reset Map">
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </Badge>
    </div>
  )
}
