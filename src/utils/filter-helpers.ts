import { Array as Arr, Option, Predicate, HashSet, Boolean as Bool } from "effect"

export type FilterSpec<T> = {
	values: readonly string[] | undefined
	match: (item: T, value: string) => boolean
}

function shouldApply(values: readonly string[] | undefined): values is readonly string[] {
	return Predicate.isNotNullish(values) && values.length > 0
}

/**
 * AND across specs; OR within each spec's `values`.
 */
export function applyFilters<T>(items: readonly T[], specs: ReadonlyArray<FilterSpec<T>>): T[] {
	let result = [...items]

	for (const spec of specs) {
		if (!shouldApply(spec.values)) continue
		const vals = spec.values
		result = Arr.filter(result, item => Arr.some(vals, val => spec.match(item, val)))
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
		Predicate.isNotUndefined(sortKey) && Arr.some(specs, s => s.key === sortKey)
			? sortKey
			: defaultKey

	const spec = Option.getOrUndefined(Arr.findFirst(specs, s => s.key === resolvedKey))

	if (!(Predicate.isNotNullish(spec) && Predicate.isTruthy(spec))) return [...items]
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

/** Retain allowed filter slugs; omit absent or empty selections. */
export function filterSearchParam(
	allowed: HashSet.HashSet<string>,
	values: Option.Option<readonly string[]>,
): Option.Option<string[]> {
	return values.pipe(
		Option.flatMap(values => {
			const matched = Arr.filter(values, value => HashSet.has(allowed, value))

			return Bool.match(matched.length > 0, {
				onTrue: () => Option.some(matched),
				onFalse: Option.none,
			})
		}),
	)
}
