let docLockCount = 0
let savedHtmlOverflow = ""
let savedHtmlPaddingRight = ""

export function lockDocumentScroll(): void {
	docLockCount++
	if (docLockCount !== 1) return

	const html = document.documentElement
	savedHtmlOverflow = html.style.overflow
	savedHtmlPaddingRight = html.style.paddingRight

	const gap = Math.max(0, window.innerWidth - html.clientWidth)
	html.style.overflow = "hidden"
	if (gap > 0) html.style.paddingRight = `${gap}px`
}

export function unlockDocumentScroll(): void {
	docLockCount = Math.max(0, docLockCount - 1)
	if (docLockCount !== 0) return

	const html = document.documentElement
	html.style.overflow = savedHtmlOverflow
	html.style.paddingRight = savedHtmlPaddingRight
}

/** Test-only: resets module lock state when a test leaves the document locked. */
export function resetDocumentScrollLockForTests(): void {
	docLockCount = 0
	savedHtmlOverflow = ""
	savedHtmlPaddingRight = ""
	const html = document.documentElement
	html.style.overflow = ""
	html.style.paddingRight = ""
}
