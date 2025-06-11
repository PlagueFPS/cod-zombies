import { TypeGuards } from "@/utils/functions"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"

export const useMapSearchParams = () => {
  const searchParams = useSearchParams()
  const filterParams = searchParams.getAll("filtered")
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

  return {
    searchParams,
    filterParams,
    searchTerm,
    createParams,
    updateURLParams,
    toggleParam,
    clearParam,
  }
}