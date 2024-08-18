import React from 'react'

export default function RichImageLoader() {
  return (
    <div className='relative w-full h-auto'>
      <div className="absolute top-0 bottom-0 right-0 left-0 aspect-video h-auto flex justify-center items-center border w-full rounded-lg">
        <div className="relative h-16 w-16 border-[6px] border-solid border-r-transparent border-border rounded-full animate-spin" />
      </div>
    </div>
  )
}
