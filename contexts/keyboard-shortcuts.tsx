"use client"
import { HotkeysProvider } from "@tanstack/react-hotkeys"
// `@tanstack/react-hotkeys` doesn't have a 'use client' directive in the entry file
// which causes errors during the SSR pass in Next.js this file re-exports that same
// provider with the 'use client' directive to allow proper hydration
export { HotkeysProvider }
