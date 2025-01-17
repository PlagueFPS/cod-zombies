"use client"
import { useImageState } from "@/hooks/useImageState"
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react"

interface IFilterLogo extends Omit<DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "src"> {
  slug: string
}

export default function FilterLogo({ slug, ...props }: IFilterLogo) {
  const { imageErrored, setImageErrored } = useImageState()

  if (imageErrored) return null

  return (
    <img 
      {...props}
      src={`/${slug}_logo.png`}
      onError={() => setImageErrored(true)}
    />
  )
}
