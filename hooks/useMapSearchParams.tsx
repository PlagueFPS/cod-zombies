import { TypeGuards } from "@/utils/functions"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"

export const useMapSearchParams = () => {
  const searchParams = useSearchParams()
  const includeParams = searchParams.getAll("include")
  const excludeParams = searchParams.getAll("exclude")
  const searchTerm = searchParams.get("search") || ""

  const updateURLParams = useCallback((params: URLSearchParams) => {
    window.history.pushState(null, '', `?${params.toString()}`)
  }, [])

  const createParams = useCallback(() => {
    return new URLSearchParams(searchParams.toString())
  }, [searchParams])

  const toggleParam = useCallback((paramName: string, value: string | string[], currentValues: string[]) => {
    const params = createParams()
    params.delete(paramName)

    const valuesToToggle = TypeGuards.isArray(value) ? value : [value]
    const newValues = valuesToToggle.some(v => currentValues.includes(v))
      ? currentValues.filter(v => !value.includes(v))
      : [...currentValues, ...valuesToToggle]

    newValues.forEach(v => params.append(paramName, v))
    updateURLParams(params)

    return newValues
  }, [createParams, updateURLParams])

  const clearParam = useCallback((paramName: string) => {
    const params = createParams()
    params.delete(paramName)
    updateURLParams(params)
  }, [createParams, updateURLParams])

  const toggleIncludeParam = useCallback((value: string | string[]) => {
    return toggleParam("include", value, includeParams)
  }, [toggleParam, includeParams])

  const toggleExcludeParam = useCallback((value: string | string[]) => {
    return toggleParam("exclude", value, excludeParams)
  }, [toggleParam, excludeParams])

  const isIncluded = useCallback((type: string) => {
    const isIncluded = includeParams.length === 0 || includeParams.includes(type)
    const isExcluded = excludeParams.includes(type)

    // Include if:
    // 1. No include params and not excluded
    // 2. Included and not excluded
    return (includeParams.length === 0 && !isExcluded) || (isIncluded && !isExcluded)
  }, [includeParams, excludeParams])

  return {
    searchParams,
    includeParams,
    excludeParams,
    searchTerm,
    createParams,
    updateURLParams,
    toggleIncludeParam,
    toggleExcludeParam,
    clearParam,
    isIncluded
  }
}