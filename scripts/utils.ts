import { HashSet } from "effect"

export const SUPPORTED_IMAGE_FORMATS = HashSet.make(".jpg", ".jpeg", ".png", ".webp", ".avif")
