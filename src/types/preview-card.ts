export interface PreviewCard {
	/** Whether the card is a priority item to load eagerly */
	priority?: boolean
	/** Hint for the browser's resource priority (use sparingly for LCP images) */
	fetchPriority?: "high" | "low" | "auto"
}
