import { Option } from "effect"

/**
 * Gets the previous and next items adjacent to the given item ID.
 * This function assumes the array is sorted in descending order.
 * @param items - The array of items to search.
 * @param itemId - The ID of the item in the array to find adjacent items for.
 */
export const getAdjacentItems = <T extends { id: string }>(items: T[], itemId: string) => {
	const index = items.findIndex(item => item.id === itemId)
	if (index === -1) {
		return { prev: Option.none(), next: Option.none() }
	}
	const prevItem = items.at(index + 1)
	const nextItem = items.at(index - 1)
	let prev: Option.Option<T> = Option.none()
	let next: Option.Option<T> = Option.none()

	if (index < items.length - 1 && prevItem) {
		prev = Option.some(prevItem)
	}

	if (index > 0 && nextItem) {
		next = Option.some(nextItem)
	}

	return { prev, next }
}
