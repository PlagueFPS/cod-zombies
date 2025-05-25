"use client"
import 'leaflet/dist/leaflet.css'
import type { ImageDimensions, MapController, MapLayer } from "@/types/InteractiveMap"
import { CRS, LatLng, LatLngBounds, LatLngTuple, LeafletMouseEvent, Map } from "leaflet"
import { ImageOverlay, MapContainer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { env } from '@/env'

const mapLayers: MapLayer[] = [
  {
    id: "layer1",
    name: "Main Floor",
    image: "/layers/map-layer-1.png",
    markers: [
      {
        id: "m1",
        x: 0.3,
        y: 0.4,
        title: "Spawn Point Alpha",
        description: "Primary team spawn location with tactical advantage",
        type: "spawn",
      },
      {
        id: "m2",
        x: 0.7,
        y: 0.3,
        title: "Objective A",
        description: "Secure this area to gain control of the upper level",
        type: "objective",
      },
      {
        id: "m3",
        x: 0.5,
        y: 0.6,
        title: "Weapon Cache",
        description: "High-value equipment available for pickup",
        type: "item",
      },
      {
        id: "m4",
        x: 0.2,
        y: 0.7,
        title: "Danger Zone",
        description: "High-risk area with limited cover",
        type: "danger",
      },
    ],
  },
  {
    id: "layer2",
    name: "Lower Level",
    image: "/layers/map-layer-2.png",
    markers: [
      {
        id: "m5",
        x: 0.4,
        y: 0.5,
        title: "Spawn Point Beta",
        description: "Secondary spawn with underground access",
        type: "spawn",
      },
      {
        id: "m6",
        x: 0.6,
        y: 0.3,
        title: "Objective B",
        description: "Control room with strategic importance",
        type: "objective",
      },
      {
        id: "m7",
        x: 0.3,
        y: 0.7,
        title: "Supply Drop",
        description: "Medical supplies and ammunition",
        type: "item",
      },
    ],
  },
]

const logClickCoordinates = (currentImageDimensions: ImageDimensions | null) => (e: LeafletMouseEvent) => {
  if (!e.latlng || !currentImageDimensions) return

  const x = e.latlng.lng / currentImageDimensions.width
  const y = 1 - e.latlng.lat / currentImageDimensions.height // Flip y back to normal
  console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
}

function MapController({ currentLayer, imageDimensions, onZoomChange, currentImageDimensions }: MapController) {
  const map = useMap()

  useMapEvents({
    zoomend: () => {
      const zoom = map.getZoom()
      onZoomChange(zoom)
    },
    click: logClickCoordinates(currentImageDimensions)
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

export default function MapPage() {
  const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({})
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0)
  const [zoom, setZoom] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<Map>(null)
  const currentLayer = mapLayers[currentLayerIndex]
  const currentImageDimensions = imageDimensions[currentLayer.id]

  useEffect(() => {
    const loadImageDimensions = () => {
      const dimensions: Record<string, ImageDimensions> = {}

      for (const layer of mapLayers) {
        dimensions[layer.id] = {
          width: 1000,
          height: 1000
        }
      }

      setImageDimensions(dimensions)
      setIsLoading(false)
    }

    loadImageDimensions()
  }, [])

  const handleLayerSwitch = useCallback((layerIndex: number) => {
    if (layerIndex === currentLayerIndex) return
    setCurrentLayerIndex(layerIndex)
  }, [currentLayerIndex])

  const convertToLeafletCoords = useCallback((x: number, y: number): LatLng => {
    if (!currentImageDimensions) return new LatLng(0, 0)
    return new LatLng(
      currentImageDimensions.height - y * currentImageDimensions.height, 
      x * currentImageDimensions.width
    )
  }, [currentImageDimensions])

  const getImageBounds = useCallback((): LatLngBounds => {
    if (!currentImageDimensions) {
      return new LatLngBounds([
        [0, 0],
        [1080, 1920]
      ])
    }

    return new LatLngBounds([
      [0, 0], // Soutwest Corner
      [currentImageDimensions.height, currentImageDimensions.width] // Northeast Corner
    ])
  }, [currentImageDimensions])

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
      {/* Layer Controls */}
      <div className="absolute top-4 left-48 z-100 flex gap-2">
        <Tabs defaultValue={mapLayers[0].id}>
          <TabsList>
            { mapLayers.map((layer, index) => (
              <TabsTrigger
                key={ layer.id } 
                value={ layer.id } 
                onClick={ () => handleLayerSwitch(index) }
              >
                { layer.name }
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Map Info */}
      <div className="absolute top-4 right-4 z-100">
        <Card className="bg-card/80">
          <h2 className="font-bold text-lg text-gradient dark:dark-text-gradient">{ currentLayer.name }</h2>
          <p className="text-muted-foreground text-sm">Zoom: { zoom }</p>
        </Card>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        ref={ mapRef }
        center={
          currentImageDimensions ? [currentImageDimensions.height / 2, currentImageDimensions.width / 2] 
          : [540, 960]
        }
        zoom={ 0 }
        minZoom={ -2 }
        maxZoom={ 3 }
        crs={ CRS.Simple }
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={ false }
        attributionControl={ false }
      >
        <MapController 
          currentLayer={ currentLayer }
          imageDimensions={ currentImageDimensions }
          onZoomChange={ setZoom }
          currentImageDimensions={ currentImageDimensions }
        />

        { currentImageDimensions && (
          <ImageOverlay 
            key={ currentLayer.id }
            url={ `${env.NEXT_PUBLIC_WEBSITE_URL}${currentLayer.image}` }
            bounds={ getImageBounds() }
          />
        )}

        { currentImageDimensions && currentLayer.markers.map(marker => (
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
