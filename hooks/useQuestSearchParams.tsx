"use client"
import { useSearchParams } from "next/navigation"
import { MAP_LIMIT } from "@/utils/constants"
import { useCallback } from "react"

export function useQuestSearchParams() {
  const searchParams = useSearchParams()
  
  // Extract common parameters
  const gameParams = searchParams.getAll("game")
  const mapParams = searchParams.getAll("map")
  const difficultyParams = searchParams.getAll("difficulty")
  const pageParam = searchParams.get("page")
  const page = pageParam ? parseInt(pageParam) : 1
  
  // Helper function to update URL with new parameters
  const updateURLParams = useCallback((params: URLSearchParams) => {
    window.history.pushState(null, '', `?${params.toString()}`)
  }, [])
  
  // Helper function to create a new URLSearchParams object with current params
  const createParams = useCallback(() => {
    return new URLSearchParams(searchParams.toString())
  }, [searchParams])
  
  // Function to update page parameter
  const updatePage = useCallback((newPage: number) => {
    const params = createParams()
    params.set("page", newPage.toString())
    updateURLParams(params)
  }, [createParams, updateURLParams])
  
  // Function to validate and adjust page parameter based on total items
  const validatePageParam = useCallback((totalItems: number) => {
    const totalPages = Math.ceil(totalItems / MAP_LIMIT)
    
    if ((page > totalPages && totalPages > 0) || page < 1) {
      const validPage = page < 1 ? 1 : (totalPages > 0 ? totalPages : 1)

      if (validPage !== page) {
        updatePage(validPage)
      }
      return validPage
    }
    
    return page
  }, [page, updatePage])
  
  // Function to clear all filter parameters
  const clearAllFilters = useCallback(() => {
    const params = createParams()
    params.delete("game")
    params.delete("map")
    params.delete("difficulty")
    updateURLParams(params)
  }, [createParams, updateURLParams])
  
  // Function to toggle a parameter value
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
  
  // Function to clear a specific parameter
  const clearParam = useCallback((paramName: string) => {
    const params = createParams()
    params.delete(paramName)
    updateURLParams(params)
  }, [createParams, updateURLParams])
  
  return {
    // Parameters
    gameParams,
    mapParams,
    difficultyParams,
    page,
    searchParams,
    
    // Functions
    updatePage,
    validatePageParam,
    clearAllFilters,
    toggleParam,
    clearParam,
    createParams,
    updateURLParams
  }
}