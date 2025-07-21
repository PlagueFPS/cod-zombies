"use client"

import { createContext, use, useRef } from "react"

export type ShortcutCallback = (event: KeyboardEvent) => void

export interface ShortcutConfig {
	key: string
	callback: ShortcutCallback
	preventDefault?: boolean
	ignoreInputs?: boolean
	stopPropagation?: boolean
}

interface IKeyboardShortcutsContext {
	registerShortcut: (id: string, config: ShortcutConfig) => void
	unregisterShortcut: (id: string) => void
}

const KeyboardShortcutsContext = createContext<IKeyboardShortcutsContext | null>(null)

const matchesShortcut = (event: KeyboardEvent, shortcut: string) => {
	const parts = shortcut.toLowerCase().split("+")
	const key = parts[parts.length - 1]
	const modifiers = parts.slice(0, -1)

	const keyMatches =
		event.key.toLowerCase() === key ||
		event.code.toLowerCase() === key ||
		(key === "meta" && (event.metaKey || event.key === "Meta")) ||
		(key === "ctrl" && (event.ctrlKey || event.key === "Control")) ||
		(key === "shift" && (event.shiftKey || event.key === "Shift")) ||
		(key === "alt" && (event.altKey || event.key === "Alt"))

	if (!keyMatches) return false

	const hasCtrl = modifiers.includes("ctrl") || modifiers.includes("control")
	const hasMeta = modifiers.includes("meta") || modifiers.includes("cmd")
	const hasAlt = modifiers.includes("alt") || modifiers.includes("option")
	const hasShift = modifiers.includes("shift")

	return (
		hasCtrl === event.ctrlKey &&
		hasMeta === event.metaKey &&
		hasAlt === event.altKey &&
		hasShift === event.shiftKey
	)
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
	const shortcutsRef = useRef<Map<string, ShortcutConfig>>(new Map())
	const listenerAttachedRef = useRef(false)

	const handleKeyDown = (event: KeyboardEvent) => {
		const shortcuts = shortcutsRef.current

		for (const [_id, config] of shortcuts) {
			if (!config.key) continue

			if (matchesShortcut(event, config.key)) {
				if (config.ignoreInputs) {
					const isInputElement =
						event.target instanceof HTMLInputElement ||
						event.target instanceof HTMLTextAreaElement ||
						event.target instanceof HTMLSelectElement

					if (isInputElement) continue
				}
				if (config.preventDefault) event.preventDefault()
				if (config.stopPropagation) event.stopPropagation()

				config.callback(event)
				break // Only run the first matching shortcut
			}
		}
	}

	const attachListener = () => {
		if (listenerAttachedRef.current) return
		window.addEventListener("keydown", handleKeyDown)
		listenerAttachedRef.current = true
	}

	const detachListener = () => {
		if (!listenerAttachedRef.current) return
		window.removeEventListener("keydown", handleKeyDown)
		listenerAttachedRef.current = false
	}

	const registerShortcut = (id: string, config: ShortcutConfig) => {
		shortcutsRef.current.set(id, config)
		attachListener()
	}

	const unregisterShortcut = (id: string) => {
		shortcutsRef.current.delete(id)

		// Detach listener if no shortcuts are registered
		if (shortcutsRef.current.size === 0) detachListener()
	}

	return (
		<KeyboardShortcutsContext value={{ registerShortcut, unregisterShortcut }}>
			{children}
		</KeyboardShortcutsContext>
	)
}

export const useKeyboardShortcuts = () => {
	const context = use(KeyboardShortcutsContext)
	if (!context)
		throw new Error("useKeyboardShortcuts must be used within a KeyboardShortcutsProvider")

	return context
}
