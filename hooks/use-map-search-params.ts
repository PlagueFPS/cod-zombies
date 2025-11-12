import { Array as Arr, type Option } from "effect"
import { useSearchParams } from "next/navigation"
import { decodeSearchParams } from "@/utils/validation-schemas"

interface MapSearchParamsResult {
	/** The current URL search parameters */
	searchParams: URLSearchParams
	/** Array of types to include in the filter */
	includeParams: readonly string[]
	/** Array of types to exclude from the filter */
	excludeParams: readonly string[]
	/** The currently selected map layer */
	layerParam: Option.Option<string>
	/** Updates the URL's search parameters and updates browser history */
	updateURLParams: (params: URLSearchParams) => void
	/** Creates a new URLSearchParams object from current params */
	createParams: () => URLSearchParams
	/** Removes a parameter completely from the URL */
	clearParam: (paramName: string) => void
	/** Toggles types in the include filter */
	toggleIncludeParam: (value: string | string[]) => string[]
	/** Toggles types in the exclude filter */
	toggleExcludeParam: (value: string | string[]) => string[]
	/** Checks if a type should be included based on current filters */
	isIncluded: (type: string) => boolean
}

export const useMapSearchParams = (): MapSearchParamsResult => {
	const searchParams = useSearchParams()
	const { include, exclude, layer } = decodeSearchParams(searchParams)

	const updateURLParams = (params: URLSearchParams) => {
		window.history.replaceState(null, "", `?${params.toString()}`)
	}

	const createParams = () => {
		return new URLSearchParams(searchParams.toString())
	}

	const toggleParam = (
		paramName: string,
		value: string | string[],
		currentValues: readonly string[],
	) => {
		const params = createParams()
		params.delete(paramName)

		const valuesToToggle = Arr.ensure(value)
		const newValues = valuesToToggle.some(v => currentValues.includes(v))
			? currentValues.filter(v => !value.includes(v))
			: [...currentValues, ...valuesToToggle]

		newValues.forEach(v => {
			params.append(paramName, v)
		})
		updateURLParams(params)

		return newValues
	}

	const clearParam = (paramName: string) => {
		const params = createParams()
		params.delete(paramName)
		updateURLParams(params)
	}

	const toggleIncludeParam = (value: string | string[]) => {
		return toggleParam("include", value, include)
	}

	const toggleExcludeParam = (value: string | string[]) => {
		return toggleParam("exclude", value, exclude)
	}

	const isIncluded = (type: string) => {
		const isIncluded = include.length === 0 || include.includes(type)
		const isExcluded = exclude.includes(type)

		return !isExcluded && isIncluded
	}

	return {
		searchParams,
		includeParams: include,
		excludeParams: exclude,
		layerParam: layer,
		createParams,
		updateURLParams,
		toggleIncludeParam,
		toggleExcludeParam,
		clearParam,
		isIncluded,
	}
}
