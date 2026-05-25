/**
 * Clamps a 1-based page index to a valid range for paginated grids.
 * Mirrors {@link useFilterParams}'s `validatePageParam` correction logic without URL updates.
 */
export function resolveValidGridPage(page: number, totalItems: number, pageSize: number): number {
	const totalPages = Math.ceil(totalItems / pageSize)

	if ((page > totalPages && totalPages > 0) || page < 1) {
		return page < 1 ? 1 : totalPages > 0 ? totalPages : 1
	}

	return page
}
