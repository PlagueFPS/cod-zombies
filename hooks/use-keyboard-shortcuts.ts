import { useEffect, useId, useRef } from "react"
import { type ShortcutCallback, useKeyboardShortcuts } from "@/contexts/keyboard-shortcuts"

/**
 * Default options for the `useShortcut` hook.
 */
const DEFAULT_OPTIONS: {
	/**
	 * Whether to call `event.preventDefault()` when the shortcut is triggered.
	 * Default is `true`.
	 */
	preventDefault: boolean
	/**
	 * Whether to ignore the shortcut if the user is currently inside an input (textarea,
	 * input, select, etc). Default is `true`.
	 */
	ignoreInputs: boolean
	/**
	 * Whether to call `event.stopPropagation()` when the shortcut is triggered.
	 * Default is `false`.
	 */
	stopPropagation: boolean
} = {
	preventDefault: true,
	ignoreInputs: true,
	stopPropagation: false,
}

type ShortcutOptions = Partial<typeof DEFAULT_OPTIONS>

/**
 * A hook to register a shortcut.
 *
 * @param shortcut - The shortcut to register.
 * @param callback - The callback to call when the shortcut is triggered.
 * @param options - The options to pass to the shortcut registration.
 */
export const useShortcut = (
	shortcut: string,
	callback: ShortcutCallback,
	options: ShortcutOptions = {},
) => {
	const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
	const callbackRef = useRef(callback)
	const generatedId = useId()

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	useEffect(() => {
		const id = `${shortcut}-${generatedId}`
		const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

		registerShortcut(id, {
			key: shortcut,
			callback: event => callbackRef.current(event),
			...mergedOptions,
		})

		return () => {
			unregisterShortcut(id)
		}
	}, [shortcut, options, registerShortcut, unregisterShortcut, generatedId])
}
