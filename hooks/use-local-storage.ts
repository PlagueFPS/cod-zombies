"use client"
import { useState } from "react"

type SetValue<T> = (value: T | ((value: T) => T)) => void
type LocalStorageResult<T> = [T, SetValue<T>, () => void]
/**
 * Provides a way to store and retrieve values from the browser's local storage.
 *
 * @param key The key to store the value under in local storage.
 * @param initialValue The value to return if no value is set in local storage.
 * @returns A tuple of three values. The first value is the stored value, or the initial value if no value is set.
 * The second value is a function that can be used to set the stored value.
 * The third value is a function that can be used to delete the stored value.
 */

export const useLocalStorage = <T>(key: string, initialValue: T): LocalStorageResult<T> => {
	// Get from local storage then parse stored json or return initialValue
	const readValue = (): T => {
		// Prevent build error "window is undefined" but keep working
		if (typeof window === "undefined") {
			return initialValue
		}

		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : initialValue
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error)
			return initialValue
		}
	}

	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(readValue)

	// Return a wrapped version of useState's setter function that persists the new value to localStorage
	const setValue: SetValue<T> = value => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value

			// Save to state and local storage
			setStoredValue(valueToStore)

			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(valueToStore))
			}
		} catch (error) {
			console.warn(`Error setting localStorage key "${key}":`, error)
		}
	}

	const deleteValue = () => {
		try {
			if (typeof window !== "undefined") {
				window.localStorage.removeItem(key)
			}
			setStoredValue(initialValue)
		} catch (error) {
			console.warn(`Error deleting localStorage key "${key}":`, error)
		}
	}

	return [storedValue, setValue, deleteValue]
}
