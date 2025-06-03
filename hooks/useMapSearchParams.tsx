import { useSearchParams } from "next/navigation"
import { useCallback } from "react"

export const useMapSearchParams = () => {
  const searchParams = useSearchParams()
  const filterParams = searchParams.getAll("filtered")
  
  const updateURLParams = useCallback((params: URLSearchParams) => {
    window.history.pushState(null, '', `?${params.toString()}`)
  }, [])

  const createParams = useCallback(() => {
    return new URLSearchParams(searchParams.toString())
  }, [searchParams])

  const toggleParam = useCallback((paramName: string, value: string, currentValues: string[]) => {
    const params = createParams()
    params.delete(paramName)
    
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
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
    updateURLParams,
    toggleParam,
    clearParam,
  }
}