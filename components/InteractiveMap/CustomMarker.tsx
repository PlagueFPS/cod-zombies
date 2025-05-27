import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MapMarker } from '@/types/InteractiveMap'
import Image from 'next/image'
import { DivIcon,type LatLng } from 'leaflet'
import { Marker as LeafletMarker } from 'react-leaflet'
import { cn } from '@/lib/utils'

interface CustomMarkerProps {
  marker: MapMarker
  position: LatLng
  children?: React.ReactNode
}

export default function CustomMarker({ marker, position, children }: CustomMarkerProps) {
  const markerRef = useRef<any>(null)

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

  return (
    <LeafletMarker ref={ markerRef } position={ position }>
      { children }
    </LeafletMarker>
  )
}

function MarkerIcon({ marker }: { marker: MapMarker }) {
  const [error, setError] = useState(false)

  return (
    <div className='flex items-center justify-center size-8'>
     { !error ? <Image
        unoptimized
        src={ marker.icon } 
        alt={ marker.title } 
        width={ 128 } 
        height={ 128 }
        className={cn('size-8 object-contain', { 'size-6': marker.type === "perk" })}
        onError={ () => setError(true) }
      /> : (
        <div className='size-8 bg-primary rounded-full' />
      )}
    </div>
  )
}
