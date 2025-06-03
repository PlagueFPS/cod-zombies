import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MapMarker } from '@/types/InteractiveMap'
import Image from 'next/image'
import { DivIcon,type LatLng } from 'leaflet'
import { Marker as LeafletMarker, useMap } from 'react-leaflet'
import { cn } from '@/lib/utils'

interface CustomMarkerProps {
  marker: MapMarker
  position: LatLng
  children?: React.ReactNode
}

export default function CustomMarker({ marker, position, children }: CustomMarkerProps) {
  const markerRef = useRef<any>(null)
  const map = useMap()

  useEffect(() => {
    if (!markerRef.current) return
    const iconElement = document.createElement('div')
    iconElement.className = 'custom-marker'

    const root = createRoot(iconElement)
    root.render(<MarkerIcon marker={ marker } />)

    const customIcon = new DivIcon({
      html: iconElement,
      className: 'custom-marker-container',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })

    if (markerRef.current.setIcon) {
      markerRef.current.setIcon(customIcon)
    }

    // wait for react to finish rendering before unmounting
    return () => {
      setTimeout(() => root.unmount(), 0)
    }
  }, [marker])

  const handleClick = () => {
    map.flyTo(position, map.getZoom())
  }

  return (
    <LeafletMarker 
      ref={ markerRef } 
      position={ position }
      zIndexOffset={ marker.type === "label" ? -1000 : 1000 }
      eventHandlers={{
        click: handleClick,
      }}
    >
      { children }
    </LeafletMarker>
  )
}

function MarkerIcon({ marker }: { marker: MapMarker }) {
  const [error, setError] = useState(false)

  if (marker.type === "label") {
    return (
      <div className='flex items-center justify-center whitespace-nowrap text-sm text-white'>
        <span className='rounded shadow-lg bg-black/25 px-2 py-1'>
          { marker.title }
        </span>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center'>
     { !error && marker.icon ? <Image
        unoptimized
        src={ marker.icon } 
        alt={ marker.title } 
        width={ 128 } 
        height={ 128 }
        className={cn('size-8', { 'size-6': marker.type === "perk" && marker.id !== 'der-wunderfizz' })}
        onError={ () => setError(true) }
      /> : (
        <div className='size-8 bg-primary rounded-full' />
      )}
    </div>
  )
}
