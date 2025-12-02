import type { MapMarker } from "@/map-configs/markers"
import { Array as Arr, Option } from "effect"
import { useSearchParams } from "next/navigation"

interface MapSearchParamsResult {
	/** The current URL search parameters */
	searchParams: URLSearchParams
	/** Array of types to include in the filter */
	includeParams: string[]
	/** Array of types to exclude from the filter */
	excludeParams: string[]
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
	/** Converts include filter to exclude filter */
	convertIncludeToExclude: (markers: MapMarker[]) => void
}

export const useMapSearchParams = (): MapSearchParamsResult => {
	const searchParams = useSearchParams()
	const includeParams = Option.match(Option.fromNullable(searchParams.get("include")), {
		onSome: value => {
			const decodeValue = decodeURIComponent(value)
			return decodeValue.split(",")
		},
		onNone: (): string[] => [],
	})
	const excludeParams = Option.match(Option.fromNullable(searchParams.get("exclude")), {
		onSome: value => {
			const decodeValue = decodeURIComponent(value)
			return decodeValue.split(",")
		},
		onNone: (): string[] => [],
	})
	const layerParam = Option.fromNullable(searchParams.get("layer"))

	const updateURLParams = (params: URLSearchParams) => {
		window.history.replaceState(null, "", `?${params.toString()}`)
	}

	const createParams = () => {
		return new URLSearchParams(searchParams.toString())
	}

	const toggleParam = (paramName: string, value: string | string[], currentValues: string[]) => {
		const params = createParams()
		params.delete(paramName)

		const valuesToToggle = Arr.ensure(value)
		const newValues = valuesToToggle.some(v => currentValues.includes(v))
			? currentValues.filter(v => !value.includes(v))
			: [...currentValues, ...valuesToToggle]

		params.append(paramName, newValues.join(","))
		updateURLParams(params)

		return newValues
	}

	const clearParam = (paramName: string) => {
		const params = createParams()
		params.delete(paramName)
		updateURLParams(params)
	}

	const toggleIncludeParam = (value: string | string[]) => {
		return toggleParam("include", value, includeParams)
	}

	const toggleExcludeParam = (value: string | string[]) => {
		return toggleParam("exclude", value, excludeParams)
	}

	const isIncluded = (type: string) => {
		const isIncluded = includeParams.length === 0 || includeParams.includes(type)
		const isExcluded = excludeParams.includes(type)

		// Include if:
		// 1. No include params and not excluded
		// 2. Included and not excluded
		return (includeParams.length === 0 && !isExcluded) || (isIncluded && !isExcluded)
	}

	const convertIncludeToExclude = (markers: MapMarker[]) => {
		const params = createParams()
		if (params.has("include")) {
			const includeArray = includeParams.filter(v => v.length > 0)
			const excludedIds = new Set<string>()
			const excludedMarkers = markers
				.filter(marker => {
					const id = marker.type || marker.id
					if (!includeArray.includes(id) && !excludedIds.has(id)) {
						excludedIds.add(id)
						return true
					}
					return false
				})
				.map(marker => marker.type || marker.id)

			params.delete("include")
			if (excludedMarkers.length > 0) {
				params.append("exclude", excludedMarkers.join(","))
			}
			updateURLParams(params)
		}
	}

	return {
		searchParams,
		includeParams,
		excludeParams,
		layerParam,
		createParams,
		updateURLParams,
		toggleIncludeParam,
		toggleExcludeParam,
		clearParam,
		isIncluded,
		convertIncludeToExclude,
	}
}
