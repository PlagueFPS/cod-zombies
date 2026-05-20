/** Writes text to the system clipboard; returns false when the API rejects the write. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text)
		return true
	} catch {
		return false
	}
}
