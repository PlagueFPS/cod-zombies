import { Predicate } from "effect"
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
	const readValue = (): T => {
		if (typeof window === "undefined") {
			return initialValue
		}

		try {
			const item = window.localStorage.getItem(key)

			return Predicate.isNotNullish(item) && Predicate.isTruthy(item)
				? JSON.parse(item)
				: initialValue
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error)

			return initialValue
		}
	}

	const [storedValue, setStoredValue] = useState<T>(readValue)

	const setValue: SetValue<T> = value => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value

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
