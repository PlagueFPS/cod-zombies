import type { MapMarker } from "@/map-configs/markers"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Array as Arr } from "effect"
import { useCallback } from "react"

type MapSearchState = {
	include: readonly string[]
	exclude: readonly string[]
	layer?: string
}

export function uniqueMarkerIds(markers: MapMarker[]): string[] {
	const seen = new Set<string>()
	for (const marker of markers) {
		const id = marker.type || marker.id
		if (!seen.has(id)) {
			seen.add(id)
		}
	}

	return Array.from(seen)
}

export function computeIsIncluded(
	type: string,
	include: readonly string[],
	exclude: readonly string[],
): boolean {
	const inIncludeList = include.length === 0 || include.includes(type)
	const isExcluded = exclude.includes(type)
	return (include.length === 0 && !isExcluded) || (inIncludeList && !isExcluded)
}

export function buildShareableMapSearch(
	markers: MapMarker[],
	{ include, exclude, layer }: MapSearchState,
): Partial<MapSearchState> {
	const allIds = uniqueMarkerIds(markers)

	const visible = allIds.filter(id => computeIsIncluded(id, include, exclude))
	const hidden = allIds.filter(id => !computeIsIncluded(id, include, exclude))

	const next: {
		include?: string[]
		exclude?: string[]
		layer?: string
	} = {}

	if (layer !== undefined && layer !== "") {
		next.layer = layer
	}

	if (allIds.length === 0 || hidden.length === 0 || visible.length === 0) {
		return {
			include: undefined,
			exclude: undefined,
			...next,
		}
	}

	if (visible.length < hidden.length) {
		return {
			include: visible,
			exclude: undefined,
			...next,
		}
	}

	return {
		include: undefined,
		exclude: hidden,
		...next,
	}
}

export function useMapSearch() {
	const { include, exclude, layer } = useSearch({ from: "/maps/$mapId" })
	const navigate = useNavigate({ from: "/maps/$mapId" })

	const isIncluded = (type: string) => computeIsIncluded(type, include, exclude)

	const toggleInclude = (value: string | string[]) => {
		const valuesToToggle = Arr.ensure(value)
		const newValues = valuesToToggle.some(v => include.includes(v))
			? include.filter(v => !valuesToToggle.includes(v))
			: [...include, ...valuesToToggle]

		void navigate({
			replace: true,
			search: prev => ({
				...prev,
				include: newValues,
			}),
		})
	}

	const toggleExclude = (value: string | string[]) => {
		const valuesToToggle = Arr.ensure(value)
		const newValues = valuesToToggle.some(v => exclude.includes(v))
			? exclude.filter(v => !valuesToToggle.includes(v))
			: [...exclude, ...valuesToToggle]

		void navigate({
			replace: true,
			search: prev => ({
				...prev,
				exclude: newValues,
			}),
		})
	}

	const showAll = () => {
		void navigate({
			replace: true,
			search: prev => ({
				...prev,
				include: undefined,
				exclude: undefined,
			}),
		})
	}

	const hideAll = (markers: MapMarker[]) => {
		const allMarkerIds = uniqueMarkerIds(markers)
		void navigate({
			replace: true,
			search: prev => ({
				...prev,
				include: undefined,
				exclude: allMarkerIds,
			}),
		})
	}

	const updateLayer = (layerId: string | undefined) => {
		void navigate({
			replace: true,
			search: prev => ({
				...prev,
				layer: layerId,
			}),
		})
	}

	const convertIncludeToExclude = useCallback(
		(markers: MapMarker[]) => {
			if (include.length === 0) return

			const includeArray = include.filter(v => v.length > 0)
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

			void navigate({
				replace: true,
				search: prev => ({
					...prev,
					include: undefined,
					exclude: excludedMarkers,
				}),
			})
		},
		[include, navigate],
	)

	const buildShareableSearch = (markers: MapMarker[]) =>
		buildShareableMapSearch(markers, { include, exclude, layer })

	return {
		include,
		exclude,
		layer,
		isIncluded,
		toggleInclude,
		toggleExclude,
		showAll,
		hideAll,
		updateLayer,
		convertIncludeToExclude,
		buildShareableSearch,
	}
}
