import { useEffect } from 'react'

interface UseKeyboardShortcutOptions {
  shortcut: string | string[]
  callback: () => void
  options?: {
    preventDefault?: boolean
    ignoreInputs?: boolean
  }
}

const parseShortcut = (shortcut: string) => {
  const parts = shortcut.split('+').map(part => part.trim().toLowerCase())

  return {
    key: parts.pop() || '',
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
  }
}

const parseShortcuts = (shortcuts: string | string[]) => {
  return Array.isArray(shortcuts) ? shortcuts.map(parseShortcut) : [parseShortcut(shortcuts)]
}

const matchesShortcut = (
  event: KeyboardEvent,
  parsedShortcut: ReturnType<typeof parseShortcut>
) => {
  return (
    event.key.toLowerCase() === parsedShortcut.key.toLowerCase() &&
    event.ctrlKey === parsedShortcut.ctrl &&
    event.shiftKey === parsedShortcut.shift &&
    event.altKey === parsedShortcut.alt &&
    event.metaKey === parsedShortcut.meta
  )
}

/**
 * React hook to register one or more keyboard shortcuts that execute a callback when triggered.
 *
 * @param params - The options for the keyboard shortcut.
 * @param params.shortcut - A single shortcut string or array of shortcut strings (e.g., "ctrl+k" or ["ctrl+k", "cmd+k"]).
 * @param params.callback - The callback function to execute when any of the shortcuts are triggered.
 * @param params.options - Additional options for the shortcut behavior.
 * @param params.options.preventDefault - Whether to prevent the default browser action when the shortcut is triggered. Defaults to true.
 * @param params.options.ignoreInputs - Whether to ignore the shortcut when focused on input, textarea, or select elements. Defaults to true.
 *
 * @example
 * // Single shortcut
 * useKeyboardShortcut({
 *   shortcut: 'ctrl+s',
 *   callback: () => saveChanges()
 * });
 *
 * // Multiple shortcuts (useful for cross-platform support)
 * useKeyboardShortcut({
 *   shortcut: ['ctrl+k', 'cmd+k'],
 *   callback: () => openCommandPalette(),
 *   options: { preventDefault: true }
 * });
 *
 * @remarks
 * - Shortcut strings are case-insensitive
 * - Supports modifiers: "ctrl", "shift", "alt", "meta" (or "cmd")
 * - Multiple shortcuts allow for platform-specific combinations
 * - The hook automatically cleans up event listeners on unmount
 */
export function useKeyboardShortcut({ shortcut, callback, options = { preventDefault: true, ignoreInputs: true }}: UseKeyboardShortcutOptions) {
  useEffect(() => {
    const controller = new AbortController()
    const parsedShortcut = parseShortcuts(shortcut)
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (options?.ignoreInputs !== false) {
        const isInputElement =
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement
        
        if (isInputElement) return
      }

      const matches = parsedShortcut.some(shortcut => matchesShortcut(event, shortcut))

      if (matches) {
        if (options?.preventDefault !== false) {
          event.preventDefault()
        }
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyPress, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [callback, shortcut, options])
}