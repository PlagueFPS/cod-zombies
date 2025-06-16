"use client"
import 'leaflet/dist/leaflet.css'
import type { ImageDimensions, Location, MapConfig, MapController } from "@/types/InteractiveMap"
import { CRS, LatLng, LatLngBounds, LatLngTuple, LeafletMouseEvent, Map } from "leaflet"
import { ImageOverlay, MapContainer, Popup, useMap, useMapEvents } from "react-leaflet"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import CustomMarker from './CustomMarker'
import { capatilize } from "@/utils/functions"
import { useMapSearchParams } from '@/hooks/useMapSearchParams'
import { Separator } from '../ui/separator'
import { IN_DEVELOPMENT } from '@/utils/constants'
import { generateMarkerKey } from '@/map-configs/markers'
import { MarkerBadge } from '../CustomBadges/CustomBadges'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'

interface IInteractiveMap {
  mapConfig: MapConfig
}

const logClickCoordinates = (imageDimensions: ImageDimensions | null) => (e: LeafletMouseEvent) => {
  if (!IN_DEVELOPMENT || !e.latlng || !imageDimensions) return

  const x = e.latlng.lng / imageDimensions.width
  const y = 1 - e.latlng.lat / imageDimensions.height // Flip y back to normal
  console.log(`Clicked coordinates: x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`)
}

export default function InteractiveMap({ mapConfig }: IInteractiveMap) {
  const { includeParams, excludeParams, isIncluded } = useMapSearchParams()
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
  const mapRef = useRef<Map>(null)
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
      {/* We do not map through filteredMarkers for rendering to avoid icon flickering */}
      { imageDimensions && mapConfig.markers.map(marker => {
        if (!filteredMarkers.some(m => {
          if (marker.type) return marker.type === m.type
          return marker.id === m.id
        })) return null

        return marker.locations.map(location => (
          // These keys are being generated during render based on immutable data
          // Therefore these are stable keys and do not change during or between renders
          <CustomMarker
            key={ generateMarkerKey(marker.id, location) }
            id={ generateMarkerKey(marker.id, location) }
            marker={ marker }
            position={ convertToLeafletCoords(location) }
          >
            { marker.type !== "label" ? (
              <Popup className='custom-popup'>
                <div className="absolute top-4 left-4 flex items-center gap-2 mb-1 w-full">
                  <MarkerBadge category={ marker.category }>
                    { capatilize(marker.category) }
                  </MarkerBadge>
                </div>
                { marker.icon && (
                  <div className='flex items-center justify-center w-full'>
                    <NextImage
                      unoptimized
                      src={marker.icon}
                      alt={marker.title}
                      width={128}
                      height={128}
                      className={cn('size-16',
                        { 'size-12': marker.type === "perk" && marker.id !== 'der-wunderfizz' },
                        { 'size-12': marker.id === 'dark-aether-lantern' },
                      )}
                    />
                  </div>
                )}
                <h3 className="font-extrabold text-lg text-gradient dark:dark-text-gradient text-center">{ location.title || marker.title }</h3>
                <p className="text-sm text-foreground/90 px-2 text-center">{ location.description || marker.description }</p>
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
