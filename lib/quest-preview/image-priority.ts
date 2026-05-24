/**
 * Whether a quest grid card image should use Next.js `priority` (LCP preload).
 * Mobile: only the first card; desktop: the first four cards in the grid.
 */
export function shouldPreloadQuestPreviewImage(isMobile: boolean, questIndex: number): boolean {
	return isMobile ? questIndex === 0 : questIndex <= 3
}
