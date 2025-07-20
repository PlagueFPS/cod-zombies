import { useEffect, useId, useRef } from "react"
import { type ShortcutCallback, useKeyboardShortcuts } from "@/contexts/keyboard-shortcuts"

export const useShortcut = (
	shortcut: string,
	callback: ShortcutCallback,
	options?: {
		preventDefault: boolean
		ignoreInputs: boolean
		stopPropagation: boolean
	},
) => {
	const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
	const callbackRef = useRef(callback)
	const shortcutIdRef = useRef<string>(null)
	const generatedId = useId()

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	useEffect(() => {
		const id = `${shortcut}-${generatedId}`
		shortcutIdRef.current = id

		registerShortcut(id, {
			key: shortcut,
			callback: event => callbackRef.current(event),
			...options,
		})

		return () => {
			unregisterShortcut(id)
		}
	}, [shortcut, options, registerShortcut, unregisterShortcut, generatedId])
}
