import type { ContentPaths } from "@/types/generated/content-paths.gen"
import { files } from "@/data/last-modified.json" with { type: "json" }
import { DATE_OPTIONS } from "@/utils/constants"

/** Gets the last updated date of a content file from the generated manifest. */
export function getLastModified(filePath: ContentPaths) {
	const posixPath = filePath.replace(/\\/g, "/")
	const lastModifiedKey = `${posixPath.replace(/^.*?\/content\//, "").replace(/^content\//, "")}.mdx`
	const fileData = files[lastModifiedKey as keyof typeof files]
	if (!fileData) {
		console.warn(`Missing last-modified data for file ${filePath}`)
		return {
			lastModified: Date.now(),
			lastModifiedFormatted: new Date().toLocaleDateString(undefined, DATE_OPTIONS),
		}
	}

	return {
		lastModified: fileData.lastModified,
		lastModifiedFormatted: fileData.lastModifiedFormatted,
	}
}
