import { Array as Arr } from "effect"
import { useSearchParams } from "next/navigation"

export const useMapSearchParams = () => {
	const searchParams = useSearchParams()
	const includeParams = searchParams.getAll("include")
	const excludeParams = searchParams.getAll("exclude")
	const layerParam = searchParams.get("layer") || ""

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
	}
}
