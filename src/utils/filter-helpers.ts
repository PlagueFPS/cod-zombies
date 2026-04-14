export type FilterSpec<T> = {
	values: readonly string[] | undefined
	match: (item: T, value: string) => boolean
}

function shouldApply(values: readonly string[] | undefined): values is readonly string[] {
	return values != null && values.length > 0
}

/**
 * AND across specs; OR within each spec's `values`.
 */
export function applyFilters<T>(items: readonly T[], specs: ReadonlyArray<FilterSpec<T>>): T[] {
	let result = [...items]
	for (const spec of specs) {
		if (!shouldApply(spec.values)) continue
		const vals = spec.values
		result = result.filter(item => vals.some(val => spec.match(item, val)))
	}
	return result
}

export type SortSpec<T> = {
	key: string
	compare: (a: T, b: T) => number
}

export function applySort<T>(
	items: readonly T[],
	sortKey: string | undefined,
	specs: ReadonlyArray<SortSpec<T>>,
	defaultKey: string,
): T[] {
	const resolvedKey =
		sortKey !== undefined && specs.some(s => s.key === sortKey) ? sortKey : defaultKey
	const spec = specs.find(s => s.key === resolvedKey)
	if (!spec) return [...items]
	const out = [...items]
	out.sort(spec.compare)
	return out
}

export type PaginationResult<T> = {
	items: T[]
	page: number
	totalPages: number
	totalCount: number
	pageSize: number
}

/**
 * @param pageSize - Defaults to 12.
 */
export function paginate<T>(
	items: readonly T[],
	page: number,
	pageSize: number = 12,
): PaginationResult<T> {
	const totalCount = items.length
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
	const safePage = Math.min(Math.max(page, 1), totalPages)
	const skip = safePage <= 1 ? 0 : pageSize * safePage - pageSize
	return {
		items: items.slice(skip, skip + pageSize),
		page: safePage,
		totalPages,
		totalCount,
		pageSize,
	}
}
