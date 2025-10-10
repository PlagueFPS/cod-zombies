"use client"
import { useState } from "react"

export const useImageState = () => {
	const [imageLoaded, setImageLoaded] = useState(false)
	const [fallbackLoaded, setFallbackLoaded] = useState(false)
	const [imageErrored, setImageErrored] = useState(false)
	const [fallbackErrored, setFallbackErrored] = useState(false)

	return {
		imageLoaded,
		fallbackLoaded,
		imageErrored,
		fallbackErrored,
		setImageLoaded,
		setFallbackLoaded,
		setImageErrored,
		setFallbackErrored,
	}
}
