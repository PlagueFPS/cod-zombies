"use client"
import { useSearchParams } from "next/navigation"
import { MAP_LIMIT } from "@/utils/constants"

interface FilterParamsResult {
	/** Array of selected game parameter values */
	gameParams: string[]
	/** Array of selected map parameter values */
	mapParams: string[]
	/** Array of selected difficulty parameter values */
	difficultyParams: string[]
	/** Array of selected type parameter values */
	typeParams: string[]
	/** Array of selected completion time range parameter values */
	timeParams: string[]
	/** Current sort parameter value */
	sortParam: string | null
	/** Current page number */
	page: number
	/** Next.js searchParams object */
	searchParams: ReturnType<typeof useSearchParams>
	/**
	 * Updates the page parameter in the URL.
	 *
	 * @param newPage - The new page number to set in the URL
	 */
	updatePage: (newPage: number) => void
	/**
	 * Updates the sort parameter in the URL and resets page to 1.
	 *
	 * @param value - The sort value to set in the URL
	 */
	updateSort: (value: string) => void
	/**
	 * Function to validate and adjust the page parameter.
	 *
	 * @param totalItems - The total number of items in the filtered list
	 * @returns The validated and adjusted page number
	 */
	validatePageParam: (totalItems: number) => number
	/**
	 * Clears all filter parameters from the URL.
	 */
	clearAllFilters: () => void
	/**
	 * Toggles a parameter value in the URL.
	 *
	 * @param paramName - The name of the parameter to toggle
	 * @param value - The value to toggle
	 * @param currentValues - The current values of the parameter
	 * @returns The new values of the parameter after toggling
	 */
	toggleParam: (paramName: Param, value: string, currentValues: string[]) => string[]
	/**
	 * Clears a specific parameter from the URL.
	 *
	 * @param paramName - The name of the parameter to clear
	 */
	clearParam: (paramName: Param) => void
	/**
	 * Creates a new `URLSearchParams` object with the current search parameters.
	 *
	 * @returns A new `URLSearchParams` object initialized with the current search parameters
	 */
	createParams: () => URLSearchParams
	/**
	 * Updates the URL with the provided search parameters.
	 *
	 * @param params - The URLSearchParams object to use for updating the URL
	 */
	updateURLParams: (params: URLSearchParams) => void
}

type Param = "type" | "map" | "game" | "difficulty" | "time"

/**
 * Custom hook for managing site search parameters in the URL.
 * Provides utilities for reading, updating, and validating search parameters.
 *
 * @returns An object containing the current search parameters and utility functions
 * to manipulate them.
 */
export function useFilterParams(): FilterParamsResult {
	const searchParams = useSearchParams()

	// Extract common parameters
	const gameParams = searchParams.getAll("game")
	const mapParams = searchParams.getAll("map")
	const difficultyParams = searchParams.getAll("difficulty")
	const typeParams = searchParams.getAll("type")
	const timeParams = searchParams.getAll("time")
	const sortParam = searchParams.get("sort")
	const pageParam = searchParams.get("page")
	const page = pageParam ? parseInt(pageParam, 10) : 1

	const updateURLParams = (params: URLSearchParams) => {
		window.history.pushState(null, "", `?${params.toString()}`)
	}

	const createParams = () => {
		return new URLSearchParams(searchParams.toString())
	}

	const updatePage = (newPage: number) => {
		const params = createParams()
		params.set("page", newPage.toString())
		updateURLParams(params)
	}

	const updateSort = (value: string) => {
		const params = createParams()
		params.set("sort", value)
		params.delete("page") // Reset page parameter when sort changes
		updateURLParams(params)
	}

	const validatePageParam = (totalItems: number) => {
		const totalPages = Math.ceil(totalItems / MAP_LIMIT)

		if ((page > totalPages && totalPages > 0) || page < 1) {
			const validPage = page < 1 ? 1 : totalPages > 0 ? totalPages : 1

			if (validPage !== page) {
				updatePage(validPage)
			}
			return validPage
		}

		return page
	}

	const clearAllFilters = () => {
		const params = createParams()
		params.delete("game")
		params.delete("map")
		params.delete("difficulty")
		params.delete("type")
		params.delete("time")
		params.delete("sort")
		updateURLParams(params)
	}

	const toggleParam = (paramName: Param, value: string, currentValues: string[]) => {
		const params = createParams()
		params.delete(paramName)

		const newValues = currentValues.includes(value)
			? currentValues.filter(v => v !== value)
			: [...currentValues, value]

		newValues.forEach(v => {
			params.append(paramName, v)
		})
		updateURLParams(params)

		return newValues
	}

	const clearParam = (paramName: Param) => {
		const params = createParams()
		params.delete(paramName)
		updateURLParams(params)
	}

	return {
		// Parameters
		gameParams,
		mapParams,
		difficultyParams,
		typeParams,
		timeParams,
		sortParam,
		page,
		searchParams,

		// Functions
		updatePage,
		updateSort,
		validatePageParam,
		clearAllFilters,
		toggleParam,
		clearParam,
		createParams,
		updateURLParams,
	}
}
